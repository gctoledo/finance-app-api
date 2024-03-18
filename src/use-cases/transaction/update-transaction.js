export class UpdateTransactionUseCase {
    constructor(updateTransactionRepository) {
        this.updateTransactionRepository = updateTransactionRepository
    }

    async execute(transactionId, updateTrnsactionParams) {
        const transaction = await this.updateTransactionRepository.execute(
            transactionId,
            updateTrnsactionParams,
        )

        return transaction
    }
}
