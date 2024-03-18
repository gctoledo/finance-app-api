export class DeleteTransactionUseCase {
    constructor(deleteTransactionRepository) {
        this.deleteTransactionRepository = deleteTransactionRepository
    }

    async execute(transactionId) {
        const transaction =
            this.deleteTransactionRepository.execute(transactionId)

        return transaction
    }
}
