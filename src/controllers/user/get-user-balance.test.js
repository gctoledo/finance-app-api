import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance.js'

describe('GetUserBalanceController', () => {
    class GetUserBalanceUseCaseStub {
        async execute() {
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

    it('should return 400 when user id is invalid', async () => {
        //arrange
        const { getUserBalanceController } = makeSut()

        //act
        const result = await getUserBalanceController.execute({
            params: { userId: 'invalid_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 500 when GetUserBalanceUseCase throws', async () => {
        //arrange
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut()

        jest.spyOn(getUserBalanceUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await getUserBalanceController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserBalanceUseCase with correct params', async () => {
        //arrange
        const { getUserBalanceController, getUserBalanceUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserBalanceUseCase, 'execute')

        //act
        await getUserBalanceController.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
