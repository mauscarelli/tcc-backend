import { checkRequired } from '@/shared/validate'
import { ClassroomRepository } from '../../infra/repositories/classroom.repository'
import { Classroom } from '../entities/classroom'

export class CreateClassroomUseCase {
    private readonly classroomRepository: ClassroomRepository
    constructor () {
      this.classroomRepository = new ClassroomRepository()
    }

    async execute (request: Classroom): Promise<number> {
      await CreateClassroomUseCase.validateRequest(request)

      return this.classroomRepository.createClassroom(request)
    }

    private static async validateRequest (request: Classroom): Promise<void> {
      await checkRequired(request.schoolName, 'schoolName')
      await checkRequired(request.className, 'className')
      await checkRequired(request.professorId, 'professorId')
    }
}
