import {
    serverError,
    ok,
    notFound,
    invalidIdResponse,
    checkIfIdIsValid,
} from './helpers/index.js'
import { GetUserByIdUseCase } from '../use-cases/index.js'

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
