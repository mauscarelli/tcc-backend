import { User } from '@/feature/user/domain/entities/user'
import { Game } from './game'

export class StartGameRequest {
    player: User
    game?: Game
    dataFormat: object
}
