import { ZodError } from 'zod'
import { EmailAlreadyInUseError } from '../../errors/user.js'
import { updateUserSchema } from '../../schemas/index.js'
import {
    invalidIdResponse,
    checkIfIdIsValid,
    badRequest,
    ok,
    serverError,
} from '../helpers/index.js'

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

            await updateUserSchema.parseAsync(updateUserParams)

            const updatedUser = await this.updateUserUseCase.execute(
                userId,
                updateUserParams,
            )

            return ok(updatedUser)
        } catch (err) {
            if (err instanceof ZodError) {
                return badRequest({ message: err.errors[0].message })
            }

            if (err instanceof EmailAlreadyInUseError) {
                return badRequest({ message: err.message })
            }

            console.error(err)

            return serverError()
        }
    }
}
