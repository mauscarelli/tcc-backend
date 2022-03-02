import { User } from '@/feature/user/domain/entities/User'
import { checkRequired } from '@/shared/validate'
import { UserRepository } from '../../infra/repositories/user.repository'

export class RegisterUseCase {
  async register (request: User): Promise<string> {
    await RegisterUseCase.validateRequest(request)

    const userRepository = new UserRepository()

    return userRepository.register(request)
  }

  private static async validateRequest (request: User): Promise<void> {
    await checkRequired(request.username, 'username')
    await checkRequired(request.password, 'password')
    await checkRequired(request.firstName, 'firstName')
    await checkRequired(request.lastName, 'lastName')
    await checkRequired(request.age, 'age')
  }
}
