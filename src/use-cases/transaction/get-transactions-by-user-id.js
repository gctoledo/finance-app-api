import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByUserIdRepository) {
        this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository
        this.getUserByUserIdRepository = getUserByUserIdRepository
    }

    async execute(userId) {
        const user = await this.getUserByUserIdRepository.execute(userId)

        if (!user) {
            throw new UserNotFoundError(userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(userId)

        return transactions
    }
}
