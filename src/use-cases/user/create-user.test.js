import { EmailAlreadyInUseError } from '../../errors/user.js'
import { CreateUserUseCase } from './create-user.js'
import { user as fixtureUser } from '../../tests/index.js'

describe('CreateUserUseCase', () => {
    const user = {
        ...fixtureUser,
        id: undefined,
    }
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generated_id'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepository = new GetUserByEmailRepositoryStub()
        const createUserRepository = new CreateUserRepositoryStub()

        const passwordHasherAdapter = new PasswordHasherAdapterStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const createUserUseCase = new CreateUserUseCase(
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        )

        return {
            createUserUseCase,
            getUserByEmailRepository,
            createUserRepository,
            passwordHasherAdapter,
            idGeneratorAdapter,
        }
    }

    it('should create a user successfully', async () => {
        //arrange
        const { createUserUseCase } = makeSut()

        //act
        const createdUser = await createUserUseCase.execute(user)

        //assert
        expect(createdUser).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUseError if GetUserByEmailRepository returns a user', async () => {
        //arrange
        const { createUserUseCase, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockReturnValueOnce(
            user,
        )

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        await expect(promise).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGeneratorAdapter to generate a random id', async () => {
        //arrange
        const { createUserUseCase, idGeneratorAdapter, createUserRepository } =
            makeSut()

        const idGeneratorSpy = jest.spyOn(idGeneratorAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        //act
        await createUserUseCase.execute(user)

        //assert
        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should PasswordHasherAdapter to cryptograph password', async () => {
        //arrange
        const {
            createUserUseCase,
            createUserRepository,
            passwordHasherAdapter,
        } = makeSut()

        const passwordHasherSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepository,
            'execute',
        )

        //act
        await createUserUseCase.execute(user)

        //assert
        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            password: 'hashed_password',
            id: 'generated_id',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        //arrange
        const { createUserUseCase, getUserByEmailRepository } = makeSut()

        jest.spyOn(getUserByEmailRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        //arrange
        const { createUserUseCase, idGeneratorAdapter } = makeSut()

        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(() => {
            throw new Error()
        })

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        //arrange
        const { createUserUseCase, passwordHasherAdapter } = makeSut()

        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        expect(promise).rejects.toThrow()
    })

    it('should throw if CreateUserRepository throws', async () => {
        //arrange
        const { createUserUseCase, createUserRepository } = makeSut()

        jest.spyOn(createUserRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        //act
        const promise = createUserUseCase.execute(user)

        //assert
        expect(promise).rejects.toThrow()
    })
})
