import { Room, RoomStatus } from '@/feature/game/domain/entities/room'
import { User } from '@/feature/user/domain/entities/User'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

export function socketInit (server: HttpServer): Server {
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

    socket.on('create-room', (player: User) => {
      const room = findEmptyRoom()
      if (room) {
        console.log(`Room number ${room.id} created`)

        socket.join(room.id)
        room.addPlayer(socket.id, player)

        return socket.emit('success', `Room number ${room.id}`)
      } else {
        return socket.emit('err', 'ERRO, nenhuma sala disponível')
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
