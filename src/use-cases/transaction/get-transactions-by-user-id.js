import { userNotFoundResponse } from '../../controllers/helpers/index.js'

export class GetTransactionsByUserId {
    constructor(getTransactionsByUserIdRepository, getUserByUserIdRepository) {
        ;(this.getTransactionsByUserIdRepository =
            getTransactionsByUserIdRepository),
            (this.getUserByUserIdRepository = getUserByUserIdRepository)
    }

    async execute(params) {
        //VALIDAR SE O USUARIO EXISTE
        const user = await this.getUserByUserIdRepository.execute(params.userId)

        if (!user) {
            return userNotFoundResponse()
        }

        const transactions =
            await this.getTransactionsByUserIdRepository.execute(params.userId)

        return transactions
    }
}
