const io = require('socket.io-client')

const games = io.connect('http://localhost:3000/games')

const player = {
  id: '123',
  username: 'scarelli'
}

const player2 = {
  id: '456',
  username: 'roberto'
}

const player3 = {
  id: '789',
  username: 'claudio'
}

games.emit('create-room', player)

// games.emit('join-room', '1', player2)

games.on('joined-room', (players, msg) => {
  console.log(msg)
  console.log(`Players connected: ${JSON.stringify(players)}`)
})

games.on('newPlayer', (res) => { console.log(res) })

games.on('player-disconnected', (res) => { console.log(res) })

games.on('err', (err) => { console.log(err) })

games.on('success', (res) => { console.log(res) })

games.on('serverToClient', (res) => { console.log(res) })
