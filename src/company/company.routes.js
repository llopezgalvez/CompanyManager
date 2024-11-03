'use strict'

import { Router } from 'express'
import { validateJwt } from '../middlewares/validate-jwt.js'
import { addCompany, getCompanies, updateCompany, createExcel, getCompaniesAZ, getCompaniesZA, getCompaniesForYear, getCompaniesForCategory } from './company.controller.js'

const api = Router()

api.post('/addCompany', [validateJwt] ,addCompany)
api.put('/updateCompany/:id', [validateJwt], updateCompany)
api.get('/getCompanies', [validateJwt], getCompanies)
api.get('/getCompaniesAZ', [validateJwt], getCompaniesAZ)
api.get('/getCompaniesZA', [validateJwt], getCompaniesZA)
api.get('/getCompaniesForYear', [validateJwt], getCompaniesForYear)
api.get('/getCompaniesForCategory', [validateJwt], getCompaniesForCategory)

api.get('/informe', [validateJwt] , createExcel)

export default api