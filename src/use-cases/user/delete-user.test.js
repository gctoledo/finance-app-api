import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user.js'
import { user } from '../../tests/index.js'

describe('DeleteUserUseCase', () => {
    class DeleteUserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepository = new DeleteUserRepositoryStub()

        const deleteUserUseCase = new DeleteUserUseCase(deleteUserRepository)

        return { deleteUserUseCase, deleteUserRepository }
    }

    it('should delete a user successfully', async () => {
        //arrange
        const { deleteUserUseCase } = makeSut()

        //act
        const deletedUser = await deleteUserUseCase.execute(faker.string.uuid())

        //assert
        expect(deletedUser).toEqual(user)
    })

    it('should call DeleteUserRepository with correct id', async () => {
        //arrange
        const { deleteUserUseCase, deleteUserRepository } = makeSut()
        const userId = faker.string.uuid()
        const executeSpy = jest.spyOn(deleteUserRepository, 'execute')

        //act
        await deleteUserUseCase.execute(userId)

        //assert
        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        //arrange
        const { deleteUserUseCase, deleteUserRepository } = makeSut()
        const userId = faker.string.uuid()
        jest.spyOn(deleteUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const result = deleteUserUseCase.execute(userId)

        //assert
        expect(result).rejects.toThrow()
    })
})
