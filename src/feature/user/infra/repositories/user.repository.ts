import pool from '@/configs/dbconfig'
import { BCryptService } from '@/services/bcrypt.service'
import { BadRequest, InternalServerError, Unauthorized } from '@curveball/http-errors/dist'
import { Guid } from 'guid-typescript'
import { User } from '../../domain/entities/user'

export class UserRepository {
    private readonly bcryptService: BCryptService

    constructor () {
      this.bcryptService = new BCryptService()
    }

    async register (request: User): Promise<string> {
      try {
        const client = await pool.connect()

        const sqlSelect = 'SELECT * FROM users WHERE username = $1'

        const { rows } = await client.query(sqlSelect, [request.username])

        if (rows.length) {
          return Promise.reject(new BadRequest('Nome de usuário já existe'))
        }

        const sqlInsert = 'INSERT INTO users(id,username,password,firstName,lastName,age) VALUES($1,$2,$3,$4,$5,$6) RETURNING id'
        const values = [Guid.create().toString(), request.username, this.bcryptService.getEncryptedPassword(request.password), request.firstName, request.lastName, request.age]

        return await client.query(sqlInsert, values).then(res => {
          return res.rows[0].id
        })
      } catch (err) {
        console.log('Erro: ' + JSON.stringify(err))
        return Promise.reject(new InternalServerError())
      }
    }

    async login (request: User): Promise<User> {
      try {
        const client = await pool.connect()

        const sqlSelect = 'SELECT * FROM users WHERE username = $1'

        const { rows } = await client.query(sqlSelect, [request.username])

        if (!rows.length) {
          return Promise.reject(new BadRequest('Usuário não encontrado'))
        }

        const foundUser = rows[0]
        if (!this.bcryptService.compareStrings(request.password, foundUser.password)) {
          return Promise.reject(new Unauthorized('Senha incorreta'))
        }

        const result = new User()
        result.id = foundUser.id
        result.username = foundUser.username
        result.firstName = foundUser.firstname
        result.lastName = foundUser.lastname
        result.age = foundUser.age

        return Promise.resolve(result)
      } catch (err) {
        console.log('Erro: ' + JSON.stringify(err))
        return Promise.reject(new InternalServerError())
      }
    }
}
