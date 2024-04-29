import { DeleteUserController } from './delete-user.js'
import { faker } from '@faker-js/faker'

describe('DeleteUserController', () => {
    class DeleteUserUseCaseStub {
        execute() {
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
        const deleteUserUseCase = new DeleteUserUseCaseStub()
        const deleteUserController = new DeleteUserController(deleteUserUseCase)

        return { deleteUserUseCase, deleteUserController }
    }

    const httpRequest = {
        params: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 if user is deleted', async () => {
        // arrange
        const { deleteUserController } = makeSut()

        // act
        const result = await deleteUserController.execute(httpRequest)

        // assert
        expect(result.statusCode).toBe(200)
    })

    it('should return 400 if id is invalid', async () => {
        // arrange
        const { deleteUserController } = makeSut()

        // act
        const result = await deleteUserController.execute({
            params: { userId: 'invalid_id' },
        })

        // assert
        expect(result.statusCode).toBe(400)
    })
})
