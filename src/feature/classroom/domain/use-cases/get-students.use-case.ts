import { User } from '@/feature/user/domain/entities/user'
import { checkRequired } from '@/shared/validate'
import { ClassroomRepository } from '../../infra/repositories/classroom.repository'

export class GetStudentsUseCase {
    private readonly classroomRepository: ClassroomRepository
    constructor () {
      this.classroomRepository = new ClassroomRepository()
    }

    async execute (request: string): Promise<User[]> {
      await GetStudentsUseCase.validateRequest(request)

      return this.classroomRepository.getStudents(request)
    }

    private static async validateRequest (request: string): Promise<void> {
      await checkRequired(request, 'classroomId')
    }
}
