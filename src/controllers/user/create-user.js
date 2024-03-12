import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
    emailIsAlreayInUseResponse,
    invalidPasswordResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
    badRequest,
    created,
    serverError,
    validateRequiredFields,
} from '../helpers/index.js'

export class CreateUserController {
    constructor(createUserUseCase) {
        this.createUserUseCase = createUserUseCase
    }
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const requiredFieldsValidation = validateRequiredFields(
                params,
                requiredFields,
            )

            if (!requiredFieldsValidation.ok) {
                return badRequest({
                    message: `The field(s) ${requiredFieldsValidation.missingFields.join(', ')} is required`,
                })
            }

            const passwordIsValid = checkIfPasswordIsValid(params.password)

            if (!passwordIsValid) {
                return invalidPasswordResponse()
            }

            const emailIsValid = checkIfEmailIsValid(params.email)
            if (!emailIsValid) {
                return emailIsAlreayInUseResponse()
            }

            const createdUser = await this.createUserUseCase.execute(params)

            return created(createdUser)
        } catch (err) {
            if (err instanceof EmailAlreadyInUseError) {
                return badRequest({ message: err.message })
            }

            console.log(err)

            return serverError()
        }
    }
}
