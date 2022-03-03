import { RegisterMoveRequest } from '@/feature/game/domain/entities/registerMove'
import { Room, RoomStatus } from '@/feature/game/domain/entities/room'
import { StartGameRequest } from '@/feature/game/domain/entities/startGameRequest'
import { FindGameUseCase } from '@/feature/game/domain/use-cases/find-game.use-case'
import { RegisterMoveUseCase } from '@/feature/game/domain/use-cases/register-move.use-case'
import { StartGameUseCase } from '@/feature/game/domain/use-cases/start-game.use-case'
import { User } from '@/feature/user/domain/entities/user'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

export function socketInit (server: HttpServer): Server {
  const findGameUseCase = new FindGameUseCase()
  const startGameUseCase = new StartGameUseCase()
  const registerMoveUseCase = new RegisterMoveUseCase()

  function createRooms (): Room[] {
    const roomArr:Room[] = []
    for (let i = 1; i <= 2; i++) {
      roomArr.push(new Room(i.toString()))
    }
    return roomArr
  }

  function findEmptyRoom (): Room | undefined {
    return rooms.find((room) => room.status === RoomStatus.Empty)
  }

  function findRoom (id: string): Room | undefined {
    return rooms.find((room) => room.id === id)
  }

  function findRoomBySocketId (socketId: string): Room | undefined {
    return rooms.find((room) => room.players.has(socketId))
  }

  function leaveRoom (server: Server, room: Room | undefined, socketId: string): void {
    if (room) {
      const player = room.removePlayer(socketId)
      if (player) {
        server.of('/games').in(room.id).emit('player-disconnected', `${player.username} saiu da sala`)
      }
    }
  }

  const io = new Server(server)
  const rooms = createRooms()

  console.log('Socket started')

  io.of('/games').on('connection', (socket) => {
    console.log(`socketId ${socket.id} connected`)

    socket.emit('serverToClient', 'Connection successful')

    socket.on('create-room', async (player: User, gameId: string) => {
      try {
        const game = await findGameUseCase.execute(gameId)

        const room = findEmptyRoom()
        if (room) {
          console.log(`Room number ${room.id} created`)

          socket.join(room.id)
          room.addPlayer(socket.id, player)
          room.setGame(game)

          return socket.emit('success', `Room number ${room.id}`)
        } else {
          return socket.emit('err', 'ERRO, nenhuma sala disponível')
        }
      } catch (e) {
        console.log('Erro:' + e)
        return socket.emit('err', 'ERRO, não foi possível criar o jogo')
      }
    })

    socket.on('join-room', (roomId, player: User) => {
      const room = findRoom(roomId)
      if (room) {
        console.log(`joining room ${room.id}`)

        socket.join(room.id)
        room.addPlayer(socket.id, player)
        io.of('/games').in(room.id).emit('newPlayer', `${player.username} entrou na sala`)
        return socket.emit('joined-room', room.listPlayers(), 'Successfuly joined the room')
      } else {
        return socket.emit('err', 'ERRO, sala não encontrada')
      }
    })

    socket.on('start-game', async (roomId, player: User, dataFormat) => {
      const room = findRoom(roomId)
      if (room) {
        console.log(`starting game on room ${room.id}`)

        const request = new StartGameRequest()
        request.player = player
        request.dataFormat = dataFormat
        request.game = room.game

        const table = await startGameUseCase.execute(request)

        room.startGame(table)

        io.of('/games').in(room.id).emit('game-started', 'Jogo iniciado')
      } else {
        return socket.emit('err', 'ERRO, sala não encontrada')
      }
    })

    socket.on('play', async (roomId, player: User, move) => {
      const room = findRoom(roomId)
      if (room) {
        console.log(`move received on room ${room.id}`)

        const request = new RegisterMoveRequest()
        request.player = player
        request.move = move
        request.gameId = room.game?.id
        request.tableName = room.table
        try {
          await registerMoveUseCase.execute(request)

          io.of('/games').in(room.id).emit('played-move', { player, move })
        } catch (e) {
          console.log('Erro:' + e)
          return socket.emit('err', 'ERRO, jogada invalida')
        }
      } else {
        return socket.emit('err', 'ERRO, sala não encontrada')
      }
    })

    socket.on('leave-room', (roomId) => {
      const room = findRoom(roomId)
      leaveRoom(io, room, socket.id)
    })

    socket.on('disconnect', () => {
      console.log(`socketId ${socket.id} disconnected`)
      const room = findRoomBySocketId(socket.id)
      leaveRoom(io, room, socket.id)
    })
  })

  return io
}
