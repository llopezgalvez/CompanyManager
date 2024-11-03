'use strict'

import jwt from 'jsonwebtoken'

const secretKey = 'IN6AVLess2022064$2005'

export const generateToken = async(payload) =>{
    try {
        return jwt.sign(payload, secretKey,{
            expiresIn: '30d',
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error)
    }
}