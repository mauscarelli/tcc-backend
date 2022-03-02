import 'dotenv/config'
import express, { Application } from 'express'
import 'reflect-metadata'
import pool from './configs/dbconfig'
import { createServer, Server as HttpServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import { socketInit } from './routes/socket'
import router from './routes/routes'

class Server {
    private app: Application;
    private httpServer: HttpServer;
    private io: SocketServer;

    constructor () {
      this.config()
      this.dbConnect()
    }

    private config () {
      this.app = express()
      this.app.use(express.urlencoded({ extended: true }))
      this.app.use(express.json({ limit: '1mb' }))

      this.app.use(router)
      this.httpServer = createServer(this.app)
    }

    private dbConnect () {
      pool.connect((err: Error) => {
        if (err) throw err
        console.log('Connected')
      })
    }

    public start = (port: number) => {
      return new Promise((resolve, reject) => {
        this.httpServer.listen(port, () => {
          this.io = socketInit(this.httpServer)
          resolve(port)
        }).on('error', (err: Object) => reject(err))
      })
    }
}

export default Server
