'use strict'

import Category from './category.model.js'
import Company from '../company/company.model.js'

export const addCategory = async(req, res) =>{
    try {
        let data = req.body
        
        let categoryExists = await Category.findOne({nameCategory: data.nameCategory})
        if(categoryExists) return res.status(409).send({message: 'The category already exists'})

        let newCategory = new Category(data)
        await newCategory.save()

        return res.status(200).send({message: 'Category has been added '})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error adding category'})
    }
}

export const updateCategory = async(req, res) =>{
    try {
        let data = req.body
        let {id} = req.params

        let category = await Category.findById(id)
        if(!category) return res.status(404).send({message: 'Category not found'})

        let updateCategory = await Category.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )

        if(!updateCategory) return res.status(401).send({message: 'Category could not be updated'})

        return res.status(200).send({message: 'Successfully updated Category'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error updating category'})
    }
}

export const deleteCategory = async(req, res) =>{
    try {
        let idCategory = req.params.id
        let categoryToDelete = await Category.findOne({ _id: idCategory })
        if (!categoryToDelete) return res.status(404).send({ message: 'Category not found' })

        let defaultCategory = await Category.findOne({ nameCategory: 'Otros' })
        if (!defaultCategory) return res.status(404).send({ message: 'Default category "Otros" not found' })

        await Company.updateMany(
            { businessCategory: categoryToDelete._id },
            { businessCategory: defaultCategory._id },
            { multi: true }
        )

        await categoryToDelete.deleteOne()
        return res.status(200).send({ message: 'Category deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error while deleting category' })
    }
}

export const getCategory = async(req, res) =>{
    try {
        let categories = await Category.find()
        if(categories.length == 0) return res.status(404).send({message: 'Categories not found'})
        return res.send({categories})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error getting the list of categories'})
    }
}
