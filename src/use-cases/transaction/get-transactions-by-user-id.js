import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByUserIdRepository) {
        ;(this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository),
            (this.getUserByUserIdRepository = getUserByUserIdRepository)
    }

    async execute(params) {
        const user = await this.getUserByUserIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse()
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transactions
    }
}
