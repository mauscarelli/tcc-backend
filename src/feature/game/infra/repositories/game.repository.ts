import pool from '@/configs/dbconfig'
import { BadRequest, InternalServerError, Unauthorized } from '@curveball/http-errors/dist'
import { Game } from '../../domain/entities/game'
import { RegisterMoveRequest } from '../../domain/entities/registerMove'
import { StartGameRequest } from '../../domain/entities/startGameRequest'

export class GameRepository {
    private readonly FKViolation = '23503'
    private readonly PKViolation = '23505'

    async createMatch (request: StartGameRequest): Promise<string> {
      try {
        const client = await pool.connect()

        const sqlSelect = "SELECT nextval('matchnumber');"
        const { rows } = await client.query(sqlSelect)

        const tableName = 'match_' + rows[0].nextval

        const sqlCreate = `create table ${tableName} (id serial not null PRIMARY KEY,
"creatorid" uuid,
"creationtime" TIMESTAMP not null default now(),
"lastmodifierid" uuid,
"lastmodificationtime" TIMESTAMP default now(),
"deleterid" uuid,
"deletiontime" TIMESTAMP,
"gameid" integer not null,
"playerid" character varying not null
${this.createTableColumns(request.dataFormat)});`

        await client.query(sqlCreate)

        return tableName
      } catch (err: any) {
        console.log('Erro: ' + JSON.stringify(err))
        return Promise.reject(new InternalServerError())
      }
    }

    async registerMove (request: RegisterMoveRequest): Promise<void> {
      try {
        const client = await pool.connect()

        const sqlInsert = `INSERT INTO ${request.tableName} ${this.insertFields(request.move)}`
        const values = [request.gameId, request.player.id, ...Object.values(request.move)]

        await client.query(sqlInsert, values)
      } catch (err: any) {
        console.log('Erro: ' + JSON.stringify(err))

        if (err?.code === this.FKViolation) {
          if (err?.detail.includes('studentid')) {
            return Promise.reject(new Unauthorized('Usuário não encontrado'))
          } else {
            return Promise.reject(new BadRequest('Classe não encontrada'))
          }
        } else if (err?.code === this.PKViolation) {
          return Promise.reject(new BadRequest('Aluno já cadastrado'))
        }

        return Promise.reject(new InternalServerError())
      }
    }

    async find (request: string): Promise<Game> {
      try {
        const client = await pool.connect()

        const sqlSelect = 'SELECT id, name, minplayers, maxplayers FROM game WHERE id = $1'

        const { rows } = await client.query(sqlSelect, [request])

        if (!rows.length) {
          return Promise.reject(new BadRequest('Jogo não encontrado'))
        }

        const foundGame = rows[0]

        const result = new Game()
        result.id = foundGame.id
        result.name = foundGame.name
        result.minPlayers = foundGame.minplayers
        result.maxPlayers = foundGame.maxplayers

        return result
      } catch (err: any) {
        console.log('Erro: ' + JSON.stringify(err))
        return Promise.reject(new InternalServerError())
      }
    }

    private createTableColumns (obj: object): string {
      const keys = Object.keys(obj)
      let result = ''
      keys.forEach(key => {
        result += `, ${key.toLowerCase()} character varying`
      })
      return result
    }

    private insertFields (obj: object): string {
      const keys = Object.keys(obj)
      let result = '(gameid, playerid'
      keys.forEach(key => {
        result += `, ${key.toLowerCase()}`
      })
      result += ') VALUES($1,$2'

      const values = Object.values(obj)
      for (let i = 1; i <= values.length; i++) {
        result += `, $${i + 2}`
      }
      result += ')'
      return result
    }
}
