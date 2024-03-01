import { EmailAlreadyInUseError } from '../errors/user.js'
import {
    emailIsAlreayInUseResponse,
    invalidPasswordResponse,
    invalidIdResponse,
    checkIfPasswordIsValid,
    checkIfEmailIsValid,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from './helpers/index.js'

export class UpdateUserController {
    constructor(updateUserUseCase) {
        this.updateUserUseCase = updateUserUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isUuid = checkIfIdIsValid(userId)
            if (!isUuid) {
                return invalidIdResponse()
            }

            const updateUserParams = httpRequest.body

            const allowedFields = [
                'first_name',
                'last_name',
                'email',
                'password',
            ]

            const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
                (field) => !allowedFields.includes(field),
            )

            if (someFieldIsNotAllowed) {
                return badRequest({
                    message: 'Some provided field is not allowed.',
                })
            }

            if (updateUserParams.password) {
                const passwordIsValid = checkIfPasswordIsValid(
                    updateUserParams.password,
                )

                if (!passwordIsValid) {
                    return invalidPasswordResponse()
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = checkIfEmailIsValid(updateUserParams.email)

                if (!emailIsValid) {
                    return emailIsAlreayInUseResponse()
                }
            }

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return ok(updatedUser)
        } catch (err) {
            if (err instanceof EmailAlreadyInUseError) {
                return badRequest({ message: err.message })
            }

            console.error(err)

            return serverError()
        }
    }
}
