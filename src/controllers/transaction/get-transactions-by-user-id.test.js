import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'
import { transaction } from '../../tests/index.js'

describe('GetTransactionsByUserIdController', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return [transaction]
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

    it('should return 400 when user id is invalid', async () => {
        //arrange
        const { getTransactionsByUserIdController } = makeSut()

        //act
        const result = await getTransactionsByUserIdController.execute({
            query: { userId: 'invalid_user_id' },
        })

        //assert
        expect(result.statusCode).toBe(400)
    })

    it('should return 404 when user is not found', async () => {
        //arrange
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        //act
        const result =
            await getTransactionsByUserIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 404 when user is not found', async () => {
        //arrange
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new UserNotFoundError())

        //act
        const result =
            await getTransactionsByUserIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(404)
    })

    it('should return 500 when GetTransactionsByUserIdUseCase throws', async () => {
        //arrange
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut()
        jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        ).mockRejectedValueOnce(new Error())

        //act
        const result =
            await getTransactionsByUserIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionByUserIdUseCase with correct params', async () => {
        //arrange
        const {
            getTransactionsByUserIdController,
            getTransactionsByUserIdUseCase,
        } = makeSut()
        const executeSpy = jest.spyOn(getTransactionsByUserIdUseCase, 'execute')

        //act
        await getTransactionsByUserIdController.execute(httpRequest)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query.userId)
    })
})
