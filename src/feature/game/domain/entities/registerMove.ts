import { User } from '@/feature/user/domain/entities/user'

export class RegisterMoveRequest {
    player: User
    tableName?: string
    gameId?: number
    move: object
}
