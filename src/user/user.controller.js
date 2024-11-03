'use strict'

import { generateToken } from '../utils/generateToken.js'
import { checkPassword, encrypt, checkUpdate } from '../utils/validator.js'
import User from './user.model.js'

export const createUser = async (req, res) => {
    try {
        let data = req.body

        data.password = await encrypt(data.password)

        let user = new User(data)

        await user.save()

        return res.status(200).send({ message: 'User successfully created' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error creating user' })
    }
}

export const login = async (req, res) => {
    try {
        let { mail, username, password, phone } = req.body
        let user = await User.findOne({ $or: [{ username: username }, { password: password }, { mail: mail }, { phone: phone }] })

        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name
            }
            let token = await generateToken(loggedUser)

            return res.send(
                {
                    message: `Welcome ${loggedUser.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error logging in', error })
    }
}

export const updateUser = async (req, res) => {
    try {
        let userID = req.user.id
        let { id } = req.params
        let data = req.body
        let { oldPassword, newPassword } = req.body

        if (userID == id) {
            let user = await User.findById(id)
            if (!user) return res.status(404).send({ message: 'User not found' })

            if (oldPassword && newPassword) {
                let passwordCorrect = await checkPassword(oldPassword, user.password)
                if (!passwordCorrect) {
                    return res.status(401).send({ message: 'Old password incorrect' })
                }
                data.password = await encrypt(newPassword)
            }

            let update = checkUpdate(data, id)
            if (!update) return res.status(400).send({ message: 'There are empty fields' })

            let updateUser = await User.findByIdAndUpdate(
                { _id: id },
                data,
                { new: true }
            )
            if (!updateUser) return res.status(401).send({ message: 'User not found and not updated' })
            return res.send({ message: 'Updated user', updateUser })
        } else {
            return res.status(403).send({ message: 'Editing other profiles is not allowed' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating user', error })
    }
}

export const getUsers = async (req, res) => {
    try {
        let users = await User.find()
        if (users.length == 0) return res.status(404).send({ message: 'Users not found' })
        return res.send({ users })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error listing users' })
    }
}

