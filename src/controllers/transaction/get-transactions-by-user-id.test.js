import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [
                {
                    user_id: faker.string.uuid(),
                    id: faker.string.uuid(),
                    name: faker.string.alphanumeric(10),
                    date: faker.date.anytime().toISOString(),
                    type: 'EXPENSE',
                    amount: Number(faker.finance.amount()),
                },
            ]
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const getTransactionsByUserIdController =
            new GetTransactionsByUserIdController(
                getTransactionsByUserIdUseCase,
            )

        return {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when finding transactions by user id successfully', async () => {
        //arrange
        const { getTransactionsByUserIdController } = makeSut()

        //act
        const result =
            await getTransactionsByUserIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when missing user id param', async () => {
        //arrange
        const { getTransactionsByUserIdController } = makeSut()

        //act
        const result = await getTransactionsByUserIdController.execute({
            query: { userId: undefined },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })
})
