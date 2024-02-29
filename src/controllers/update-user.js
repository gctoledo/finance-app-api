import { badRequest, ok, serverError } from './helpers.js'
import validator from 'validator'
import { UpdateUserUseCase } from '../use-cases/update-user.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isUuid = validator.isUUID(httpRequest.params.userId)
            if (!isUuid) {
                return badRequest({
                    message: 'The provided id is not valid.',
                })
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
                const passwordIsValid = updateUserParams.password.length >= 6

                if (!passwordIsValid) {
                    return badRequest({
                        message: 'Password must be at least 6 characters.',
                    })
                }
            }

            if (updateUserParams.email) {
                const emailIsValid = validator.isEmail(updateUserParams.email)
                if (!emailIsValid) {
                    return badRequest({
                        message: 'Invalid e-mail. Please provide a valid one.',
                    })
                }
            }

            const updateUserUseCase = new UpdateUserUseCase()

            const updatedUser = await updateUserUseCase.execute(
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
