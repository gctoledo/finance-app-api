import { badRequest } from './http.js'
import validator from 'validator'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid.',
    })
}

export const requiredFieldMissingResponse = (fields) => {
    return badRequest({
        message: `The field(s) ${fields.join(', ')} is required`,
    })
}
