import { ZodError } from 'zod'
import { createTransactionSchema } from '../../schemas/index.js'
import { badRequest, created, serverError } from '../helpers/index.js'

export class CreateTransactionController {
    constructor(createTransactionUseCase) {
        this.createTransactionUseCase = createTransactionUseCase
    }

    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            await createTransactionSchema.parseAsync(params)

            const transaction =
                await this.createTransactionUseCase.execute(params)

            return created(transaction)
        } catch (err) {
            if (err instanceof ZodError) {
                return badRequest({ message: err.errors[0].message })
            }

            console.error(err)
            return serverError()
        }
    }
}
