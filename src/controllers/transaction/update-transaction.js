import { updateTransactionSchema } from '../../schemas/transaction.js'
import {
    badRequest,
    checkIfIdIsValid,
    invalidIdResponse,
    ok,
    serverError,
} from '../helpers/index.js'
import { ZodError } from 'zod'

export class UpdateTransactionController {
    constructor(updateTransactionUseCase) {
        this.updateTransactionUseCase = updateTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const idIsValid = checkIfIdIsValid(httpRequest.params.transactionId)

            if (!idIsValid) {
                return invalidIdResponse()
            }

            const params = httpRequest.body

            await updateTransactionSchema.parseAsync(params)

            const transaction = await this.updateTransactionUseCase.execute(
                httpRequest.params.transactionId,
                params,
            )

            return ok(transaction)
        } catch (err) {
            if (err instanceof ZodError) {
                return badRequest({ message: err.errors[0].message })
            }

            console.error(err)

            return serverError()
        }
    }
}
