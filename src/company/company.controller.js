'use strict'

import Company from './company.model.js'
import Category from '../category/category.model.js'

export const addCompany = async (req, res) => {
    try {
        let data = req.body

        let companyExists = await Company.findOne({ nameCompany: data.nameCompany })
        if (companyExists) return res.status(409).send({ message: 'The company already exists' })

        let newCompany = new Company(data)
        await newCompany.save()

        return res.status(200).send({ message: 'Company successfully registered' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error when creating the company' })
    }
}

export const updateCompany = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body

        let companyUpdate = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!companyUpdate) return res.status(401).send({ message: 'Company not found and not updated' })

        return res.send({ message: 'Updated company', companyUpdate })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating company' })
    }
}

export const getCompanies = async (req, res) => {
    try {
        let listOfCompany = await Company.find().populate('businessCategory', ['nameCategory', '-_id'])
        if (listOfCompany.length == 0) return res.status(404).send({ message: 'Not found' })
        return res.send({ listOfCompany })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error in obtaining companies' })
    }
}

//Obtener las empresas de A-Z
export const getCompaniesAZ = async (req, res) => {
    try {
        let listOfCompany = await Company.find().populate('businessCategory', ['nameCategory', '-_id']).sort({ nameCompany: 1 })
        if (listOfCompany.length === 0) return res.status(404).send({ message: 'Not found' })
        return res.send({ listOfCompany })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error in obtaining companies' })
    }
}

//Obtener empresas de Z-A
export const getCompaniesZA = async (req, res) => {
    try {
        let listOfCompany = await Company.find().populate('businessCategory', ['nameCategory', '-_id']).sort({ nameCompany: -1 });
        if (listOfCompany.length === 0) return res.status(404).send({ message: 'Not found' });
        return res.send({ listOfCompany });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error in obtaining companies' });
    }
}

//Obtener empresas por años de experiencia de menor a mayor
export const getCompaniesForYear = async (req, res) => {
    try {
        let listOfCompany = await Company.find().populate('businessCategory', ['nameCategory', '-_id']).sort({ yearsOfTrajectory: 1 })
        if (listOfCompany.length === 0) return res.status(404).send({ message: 'Not found' })
        return res.send({ listOfCompany })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error in obtaining companies' })
    }
}

export const getCompaniesForCategory = async (req, res) => {
    try {
        let { search } = req.body

        let category = await Category.findOne({ nameCategory: search })
        if (!category) return res.status(404).send({ message: 'Category not found' })

        let companies = await Company.find({ businessCategory: category._id })
            .populate('businessCategory', ['nameCategory', '-_id'])

        if (companies.length === 0) return res.status(404).send({ message: 'Companies not found' })

        return res.send({ companies })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error in obtaining companies' })
    }
}

//EXCEL
import xlsxPopulate from 'xlsx-populate'

export const createExcel = async (req, res) => {
    try {
        //Crear un nuevo libro de Excel en blanco
        let workbook = await xlsxPopulate.fromBlankAsync()

        //Encabezados
        workbook.sheet(0).cell('A1').value('Empresa')
        workbook.sheet(0).cell('B1').value('Impacto')
        workbook.sheet(0).cell('C1').value('Años de trayectoria')
        workbook.sheet(0).cell('D1').value('Categoría')

        //Buscar las empresas
        let companies = await Company.find().populate('businessCategory', ['nameCategory', '-_id'])

        //Colocamos los datos en su respectiva celda
        for (let i = 0; i < companies.length; i++) {
            workbook.sheet(0).cell(`A${i + 2}`).value(companies[i].nameCompany)
            workbook.sheet(0).cell(`B${i + 2}`).value(companies[i].ImpactLevel)
            workbook.sheet(0).cell(`C${i + 2}`).value(companies[i].yearsOfTrajectory)
            workbook.sheet(0).cell(`D${i + 2}`).value(companies[i].businessCategory.nameCategory)

            //Se le coloca borde a cada celda
            workbook.sheet(0).cell(`A${i + 2}`).style({
                border: true
            })

            workbook.sheet(0).cell(`B${i + 2}`).style({
                border: true
            })

            workbook.sheet(0).cell(`C${i + 2}`).style({
                border: true
            })

            workbook.sheet(0).cell(`D${i + 2}`).style({
                border: true
            })


            //Se le coloca un color a una celda si a otra celda no
            if (i % 2 === 0) {
                workbook.sheet(0).range(`A${i + 2}:D${i + 2}`).style({
                    fill: {
                        type: 'solid',
                        color: 'D8E2F1'
                    }
                })
            }
        }

        //Damos un relleno a las celdas
        workbook.sheet(0).cell('A1').style({
            fill: {
                type: 'solid',
                color: 'B7D167'
            }
        })

        workbook.sheet(0).cell('B1').style({
            fill: {
                type: 'solid',
                color: '229EAF'
            }
        })

        workbook.sheet(0).cell('C1').style({
            fill: {
                type: 'solid',
                color: 'B7D167'
            }
        })

        workbook.sheet(0).cell('D1').style({
            fill: {
                type: 'solid',
                color: '229EAF'
            }
        })

        //Propiedades que les damos a las celdas desde A1 a D1, una fila practicamente
        workbook.sheet(0).range('A1:D1').style({
            fontColor: 'white',
            fontFamily: 'Arial',
            fontSize: 12,
            bold: true,
            horizontalAlignment: 'center',
            verticalAlignment: 'middle',
            border: true
        })

        //Se asigna el espacio de la celda(ancho)
        workbook.sheet(0).column('A').width(30)
        workbook.sheet(0).column('B').width(30)
        workbook.sheet(0).column('C').width(35)
        workbook.sheet(0).column('D').width(30)

        //Centramos todo el contenido de la columna
        workbook.sheet(0).column('A').style({
            horizontalAlignment: 'center',
            verticalAlignment: 'middle'
        })

        workbook.sheet(0).column('B').style({
            horizontalAlignment: 'center',
            verticalAlignment: 'middle'
        })

        workbook.sheet(0).column('C').style({
            horizontalAlignment: 'center',
            verticalAlignment: 'middle'
        })

        workbook.sheet(0).column('D').style({
            horizontalAlignment: 'center',
            verticalAlignment: 'middle'
        })

        await workbook.toFileAsync('Reporte.xlsx')

        //Envia el archivo como respuesta para descargar
        res.download('Reporte.xlsx', (error) => {
            if (error) {
                console.error('Error al enviar el archivo como respuesta:', error)
            } else {
                console.log('Archivo enviado con éxito')
            }
        })
    } catch (error) {
        console.error(error)
        return error
    }
}