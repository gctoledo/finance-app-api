import { PostgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const deletedTransaction = await PostgresHelper.query(
            'DELETE from transactions WHERE id = $1 RETURNING *',
            [transactionId],
        )

        return deletedTransaction[0]
    }
}
