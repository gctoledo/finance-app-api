import { serverError, ok, notFound } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isUuid = validator.isUUID(httpRequest.params.userId)

            if (!isUuid) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({
                    message: 'User not found.',
                })
            }

            return ok(user)
        } catch (err) {
            console.log(err)
            return serverError()
        }
    }
}
