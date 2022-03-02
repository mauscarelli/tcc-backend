import { User } from '@/feature/user/domain/entities/User'

export enum RoomStatus{
    Empty,
    Occupied
}

export class Room {
    id: string
    status: RoomStatus
    numberOfPlayers: number
    minPlayers?: number
    maxPlayers?: number
    players: Map<string, User>
    game?: string

    constructor (roomId: string) {
      this.id = roomId
      this.status = RoomStatus.Empty
      this.numberOfPlayers = 0
      this.players = new Map<string, User>()
    }

    clearRoom (): void {
      this.status = RoomStatus.Empty
      this.numberOfPlayers = 0
      this.players.clear()
      this.game = undefined
      this.minPlayers = undefined
      this.maxPlayers = undefined
    }

    addPlayer (socketId: string, player: User): void {
      this.status = RoomStatus.Occupied
      this.players.set(socketId, player)
      this.numberOfPlayers++
    }

    removePlayer (socketId: string): User | undefined {
      const player = this.players.get(socketId)
      if (player) {
        this.players.delete(socketId)
        this.numberOfPlayers--
        if (this.numberOfPlayers <= 0) {
          this.clearRoom()
        }
      }
      return player
    }

    listPlayers (): User[] {
      const users = []
      const mapIterator = this.players.values()
      let item = mapIterator.next()
      while (!item.done) {
        users.push(item.value)
        item = mapIterator.next()
      }
      return users
    }

    toString (): string {
      const result = {
        id: this.id,
        status: this.status,
        numberOfPlayers: this.numberOfPlayers,
        minPlayers: this.minPlayers,
        maxPlayers: this.maxPlayers,
        players: this.players.toString(),
        game: this.game
      }
      return JSON.stringify(result)
    }
}
