import { serverError, ok, notFound } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import { checkIfIdIsValid } from './helpers/user.js'

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isValidId = checkIfIdIsValid(userId)

            if (!isValidId) {
                return invalidIdResponse()
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(userId)

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
