import { badRequest } from './http.js'
import validator from 'validator'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () => {
    return badRequest({
        message: 'The provided id is not valid.',
    })
}

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequiredFields = (params, requiredFields) => {
    const missingFields = []

    for (const field of requiredFields) {
        const fieldIsMissing = !params[field]

        const fieldIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], { ignore_whitespace: false })

        if (fieldIsMissing || fieldIsEmpty) {
            missingFields.push(field)
        }
    }

    if (missingFields.length > 0) {
        return {
            missingFields,
            ok: false,
        }
    }

    return {
        ok: true,
        missingFields: undefined,
    }
}
