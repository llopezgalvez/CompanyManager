import { compare, hash } from "bcrypt"

export const encrypt = (password) =>{
    try {
        return hash(password, 10)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkPassword = async(password, hash) =>{
    try {
        return await compare(password, hash)
    } catch (error) {
        console.error(error)
        return error
    }
}

export const checkUpdate = (data, userId) => {
    if (userId) {
        if (
            Object.entries(data).length === 0 ||
            data.name == '' ||
            data.lastName == '' ||
            data.mail == '' ||
            data.phone == '' ||
            data.username == '' ||
            data.password == ''
        ) return false
        return true
    }
}