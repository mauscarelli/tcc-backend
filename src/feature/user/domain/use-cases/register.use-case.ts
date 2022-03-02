import { User } from '@/feature/user/domain/entities/user'
import { checkRequired } from '@/shared/validate'
import { UserRepository } from '../../infra/repositories/user.repository'

export class RegisterUseCase {
    private readonly userRepository: UserRepository
    constructor () {
      this.userRepository = new UserRepository()
    }

    async execute (request: User): Promise<string> {
      await RegisterUseCase.validateRequest(request)

      return this.userRepository.register(request)
    }

    private static async validateRequest (request: User): Promise<void> {
      await checkRequired(request.username, 'username')
      await checkRequired(request.password, 'password')
      await checkRequired(request.firstName, 'firstName')
      await checkRequired(request.lastName, 'lastName')
      await checkRequired(request.age, 'age')
    }
}
