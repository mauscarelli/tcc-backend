import { User } from '@/feature/user/domain/entities/User'
import { checkRequired } from '@/shared/validate'
import { UserRepository } from '../../infra/repositories/user.repository'

export class LoginUseCase {
  async login (request: User): Promise<User> {
    await LoginUseCase.validateRequest(request)

    const userRepository = new UserRepository()

    return userRepository.login(request)
  }

  private static async validateRequest (request: User): Promise<void> {
    await checkRequired(request.username, 'username')
    await checkRequired(request.password, 'password')
  }
}
