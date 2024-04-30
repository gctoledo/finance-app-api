import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance.js'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        execute() {
            return faker.number.int()
        }
    }

    const makeSut = () => {
        const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
        const getUserBalanceController = new GetUserBalanceController(
            getUserBalanceUseCase,
        )

        return { getUserBalanceController, getUserBalanceUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting user balance', async () => {
        //arrange
        const { getUserBalanceController } = makeSut()

        //act
        const result = await getUserBalanceController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })
})
