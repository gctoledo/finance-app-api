import { user } from '../../tests/index.js'
import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdUseCase = new GetUserByIdUseCaseStub()
        const getUserByIdController = new GetUserByIdController(
            getUserByIdUseCase,
        )

        return { getUserByIdController, getUserByIdUseCase }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting user', async () => {
        //arrange
        const { getUserByIdController } = makeSut()

        //act
        const result = await getUserByIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when user id is invalid', async () => {
        //arrange
        const { getUserByIdController } = makeSut()

        //act
        const result = await getUserByIdController.execute({
            params: { userId: 'invalid_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        //arrange
        const { getUserByIdController, getUserByIdUseCase } = makeSut()

        //act
        jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValueOnce(null)
        const result = await getUserByIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetUserByIdUseCase throws', async () => {
        //arrange
        const { getUserByIdController, getUserByIdUseCase } = makeSut()

        jest.spyOn(getUserByIdUseCase, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await getUserByIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetUserByIdUseCase with correct params', async () => {
        //arrange
        const { getUserByIdController, getUserByIdUseCase } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdUseCase, 'execute')

        //act
        await getUserByIdController.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.params.userId)
    })
})
