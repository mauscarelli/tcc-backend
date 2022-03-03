import { checkRequired } from '@/shared/validate'
import { GameRepository } from '../../infra/repositories/game.repository'
import { StartGameRequest } from '../entities/startGameRequest'

export class StartGameUseCase {
    private readonly gameRepository: GameRepository
    constructor () {
      this.gameRepository = new GameRepository()
    }

    async execute (request: StartGameRequest): Promise<string> {
      await StartGameUseCase.validateRequest(request)

      return this.gameRepository.createMatch(request)
    }

    private static async validateRequest (request: StartGameRequest): Promise<void> {
      await checkRequired(request.player, 'player')
      await checkRequired(request.game, 'game')
      await checkRequired(request.game?.id, 'id')
      await checkRequired(request.dataFormat, 'dataFormat')
    }
}
