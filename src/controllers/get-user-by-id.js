import {
    serverError,
    ok,
    userNotFoundResponse,
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
                return userNotFoundResponse()
            }

            return ok(user)
        } catch (err) {
            console.log(err)
            return serverError()
        }
    }
}
