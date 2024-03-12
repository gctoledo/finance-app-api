import { UserNotFoundError } from '../../errors/user.js'
import { v4 as uuidv4 } from 'uuid'

export class CreateTransactionUseCase {
    constructor(postgresCreateTransactionRepository, getUserByIdRepository) {
        ;(this.postgresCreateTransactionRepository =
            postgresCreateTransactionRepository),
            (this.getUserByIdRepository = getUserByIdRepository)
    }
    async execute(createTransactionParams) {
        const userId = createTransactionParams.user_id

        const user = await this.getUserByIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactionId = uuidv4()

        const transaction =
            await this.postgresCreateTransactionRepository.execute({
                ...createTransactionParams,
                id: transactionId,
            })

        return transaction
    }
}
