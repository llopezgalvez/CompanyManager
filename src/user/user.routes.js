'use strict'

import {Router} from 'express'
import {createUser, login, getUsers, updateUser} from './user.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createUser', createUser)
api.put('/updateUser/:id', [validateJwt], updateUser)
api.post('/login', login)
api.get('/getUsers', [validateJwt], getUsers)

export default api