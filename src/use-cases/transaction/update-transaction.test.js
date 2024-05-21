import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction.js'

describe('UpdateTransactionUseCase', () => {
    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.string.alphanumeric(10),
        date: faker.date.anytime().toISOString(),
        type: 'EXPENSE',
        amount: Number(faker.finance.amount()),
    }

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                id: transactionId,
                ...transaction,
            }
        }
    }

    const makeSut = () => {
        const updateTransactionRepository =
            new UpdateTransactionRepositoryStub()

        const updateTransactionUseCase = new UpdateTransactionUseCase(
            updateTransactionRepository,
        )

        return { updateTransactionRepository, updateTransactionUseCase }
    }

    it('should update transaction successfully', async () => {
        //arrange
        const { updateTransactionUseCase } = makeSut()

        //act
        const result = await updateTransactionUseCase.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        //assert
        expect(result).toEqual(transaction)
    })
})
