import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'

describe('DeleteUserUseCase', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteUserRepositoryStub()

        const deleteUserUseCase = new DeleteUserUseCase(
            deleteUserRepositoryStub,
        )

        return { deleteUserUseCase, deleteUserRepositoryStub }
    }

    it('should delete a user successfully', async () => {
        //arrange
        const { deleteUserUseCase } = makeSut()

        //act
        const deletedUser = await deleteUserUseCase.execute(faker.string.uuid())

        //assert
        expect(deletedUser).toEqual(user)
    })
})
