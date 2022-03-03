import { checkRequired } from '@/shared/validate'
import { GameRepository } from '../../infra/repositories/game.repository'
import { Game } from '../entities/game'

export class FindGameUseCase {
    private readonly gameRepository: GameRepository
    constructor () {
      this.gameRepository = new GameRepository()
    }

    async execute (request: string): Promise<Game> {
      await FindGameUseCase.validateRequest(request)

      return this.gameRepository.find(request)
    }

    private static async validateRequest (request: string): Promise<void> {
      await checkRequired(request, 'gameId')
    }
}
