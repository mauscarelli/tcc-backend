const io = require('socket.io-client')

const games = io.connect('http://localhost:3000/games')

const player = {
  id: '38c5e172-67f7-b4dd-2e1e-04a089166601',
  username: 'teste'
}

games.emit('join-room', '1', player)

games.on('joined-room', (players, msg) => {
  console.log(msg)
  console.log(`Players connected: ${JSON.stringify(players)}`)
})

games.on('game-started', (res) => {
  console.log(res)
  games.emit('play', '1', player, { piece: 'Nf3', turn: 'b' })
})

// Recepção de eventos

games.on('played-move', (res) => { console.log('player: ' + JSON.stringify(res.player) + ' move: ' + JSON.stringify(res.move)) })

games.on('newPlayer', (res) => { console.log(res) })

games.on('player-disconnected', (res) => { console.log(res) })

games.on('err', (err) => { console.log(err) })

games.on('success', (res) => { console.log(res) })

games.on('serverToClient', (res) => { console.log(res) })
