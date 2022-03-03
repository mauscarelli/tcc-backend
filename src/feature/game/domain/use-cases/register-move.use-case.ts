import { checkRequired } from '@/shared/validate'
import { GameRepository } from '../../infra/repositories/game.repository'
import { RegisterMoveRequest } from '../entities/registerMove'

export class RegisterMoveUseCase {
    private readonly gameRepository: GameRepository
    constructor () {
      this.gameRepository = new GameRepository()
    }

    async execute (request: RegisterMoveRequest): Promise<void> {
      await RegisterMoveUseCase.validateRequest(request)

      return this.gameRepository.registerMove(request)
    }

    private static async validateRequest (request: RegisterMoveRequest): Promise<void> {
      await checkRequired(request.player, 'player')
      await checkRequired(request.tableName, 'tableName')
      await checkRequired(request.move, 'move')
    }
}
