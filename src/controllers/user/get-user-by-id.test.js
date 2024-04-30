import { GetUserByIdController } from './get-user-by-id.js'
import { faker } from '@faker-js/faker'

describe('GetUserByIdController', () => {
    class GetUserByIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({ length: 7 }),
            }
        }
    }

    const makeSut = () => {
        const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
        const getUserByIdController = new GetUserByIdController(
            getUserByIdUseCaseStub,
        )

        return { getUserByIdController, getUserByIdUseCaseStub }
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

    it('should return 500 when GetUserBalanceUseCase throws', async () => {
        //arrange
        const { getUserByIdController, getUserByIdUseCaseStub } = makeSut()

        jest.spyOn(getUserByIdUseCaseStub, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = await getUserByIdController.execute(httpRequest)

        //assert
        expect(result.statusCode).toBe(500)
    })
})
