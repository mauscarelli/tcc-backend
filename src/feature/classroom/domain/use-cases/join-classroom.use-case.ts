import { checkRequired } from '@/shared/validate'
import { ClassroomRepository } from '../../infra/repositories/classroom.repository'
import { JoinRequest } from '../entities/joinRequest'

export class JoinClassroomUseCase {
    private readonly classroomRepository: ClassroomRepository
    constructor () {
      this.classroomRepository = new ClassroomRepository()
    }

    async execute (request: JoinRequest): Promise<void> {
      await JoinClassroomUseCase.validateRequest(request)

      return this.classroomRepository.join(request)
    }

    private static async validateRequest (request: JoinRequest): Promise<void> {
      await checkRequired(request.studentId, 'userId')
      await checkRequired(request.classroomId, 'classroomId')
    }
}
