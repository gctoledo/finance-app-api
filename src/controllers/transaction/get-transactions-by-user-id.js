import {
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    requiredFieldMissingResponse,
    serverError,
    userNotFoundResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdController {
    constructor(getTransactionsByUserIdUseCase) {
        this.getTransactionsByUserIdUseCase = getTransactionsByUserIdUseCase
    }

    async execute(httpRequest) {
        try {
            const userId = httpRequest.query.userId

            if (!userId) {
                return requiredFieldMissingResponse(['userId'])
            }

            const userIdIsValid = checkIfIdIsValid(userId)

            if (!userIdIsValid) {
                return invalidIdResponse()
            }

            const transactions =
                await this.getTransactionsByUserIdUseCase.execute({ userId })

            return ok(transactions)
        } catch (err) {
            console.error(err)

            if (err instanceof UserNotFoundError) {
                return userNotFoundResponse()
            }

            return serverError()
        }
    }
}
