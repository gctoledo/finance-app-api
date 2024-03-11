import {
    serverError,
    ok,
    userNotFoundResponse,
    invalidIdResponse,
    checkIfIdIsValid,
} from '../helpers/index.js'

export class GetUserByIdController {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase
    }
    async execute(httpRequest) {
        try {
            const userId = httpRequest.params.userId

            const isValidId = checkIfIdIsValid(userId)

            if (!isValidId) {
                return invalidIdResponse()
            }

            const user = await this.getUserByIdUseCase.execute(userId)

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
