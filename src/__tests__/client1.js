const io = require('socket.io-client')

const games = io.connect('http://localhost:3000/games')

const player = {
  id: 'cc646ddf-828f-2442-ad8d-f37184f189c5',
  username: 'scarelli'
}

games.emit('create-room', player, '1')

games.on('newPlayer', (res) => {
  console.log(res)
  games.emit('start-game', '1', player, { piece: '', turn: '' })
})

games.on('played-move', (res) => {
  console.log('player: ' + JSON.stringify(res.player) + ' move: ' + JSON.stringify(res.move))
  if (res.player.id !== player.id) { games.emit('play', '1', player, { piece: 'Qc1', turn: 'w' }) }
})

games.on('err', (err) => { console.log(err) })

games.on('game-started', (res) => { console.log(res) })

games.on('joined-room', (players, msg) => {
  console.log(msg)
  console.log(`Players connected: ${JSON.stringify(players)}`)
})

games.on('success', (res) => { console.log(res) })

games.on('serverToClient', (res) => { console.log(res) })

games.on('player-disconnected', (res) => { console.log(res) })
