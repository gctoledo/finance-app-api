import { UserNotFoundError } from '../../errors/user.js'

export class GetTransactionsByUserIdUseCase {
    constructor(getTransactionsByUserIdRepository, getUserByUserIdRepository) {
        ;(this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository),
            (this.getUserByUserIdRepository = getUserByUserIdRepository)
    }

    async execute(params) {
        // VALIDANDO SE O USUARIO EXISTE
        const user = await this.getUserByUserIdRepository.execute(params.userId)

        if (!user) {
            throw new UserNotFoundError(params.userId)
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transactions
    }
}
