import { User } from '@/feature/user/domain/entities/user'
import { checkRequired } from '@/shared/validate'
import { UserRepository } from '../../infra/repositories/user.repository'

export class LoginUseCase {
    private readonly userRepository: UserRepository
    constructor () {
      this.userRepository = new UserRepository()
    }

    async execute (request: User): Promise<User> {
      await LoginUseCase.validateRequest(request)

      return this.userRepository.login(request)
    }

    private static async validateRequest (request: User): Promise<void> {
      await checkRequired(request.username, 'username')
      await checkRequired(request.password, 'password')
    }
}
