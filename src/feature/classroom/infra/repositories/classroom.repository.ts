import pool from '@/configs/dbconfig'
import { User } from '@/feature/user/domain/entities/user'
import { BCryptService } from '@/services/bcrypt.service'
import { BadRequest, InternalServerError, Unauthorized } from '@curveball/http-errors/dist'
import { Classroom } from '../../domain/entities/classroom'
import { JoinRequest } from '../../domain/entities/joinRequest'

export class ClassroomRepository {
    private readonly bcryptService: BCryptService
    private readonly FKViolation = '23503'
    private readonly PKViolation = '23505'

    constructor () {
      this.bcryptService = new BCryptService()
    }

    async createClassroom (request: Classroom): Promise<number> {
      try {
        const client = await pool.connect()

        const sqlInsert = 'INSERT INTO classroom(professorid,school,class) VALUES($1,$2,$3) RETURNING id'
        const values = [request.professorId, request.schoolName, request.className]

        return await client.query(sqlInsert, values).then(res => {
          return res.rows[0].id
        })
      } catch (err: any) {
        console.log('Erro: ' + JSON.stringify(err))
        if (err?.code === this.FKViolation) {
          return Promise.reject(new Unauthorized('Usuário não encontrado'))
        }
        return Promise.reject(new InternalServerError())
      }
    }

    async join (request: JoinRequest): Promise<void> {
      try {
        const client = await pool.connect()

        const sqlInsert = 'INSERT INTO user_classroom(classroomid,studentid) VALUES($1,$2)'
        const values = [request.classroomId, request.studentId]

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

    async getStudents (request: string): Promise<User[]> {
      try {
        const client = await pool.connect()

        const sqlInsert = 'SELECT u.id, u.firstname, u.lastname FROM users u, user_classroom c WHERE u.id = c.studentid AND c.classroomid = $1'
        const values = [request]

        return await client.query(sqlInsert, values).then(res => {
          return res.rows.map((item) => {
            const user = new User()
            user.id = item.id
            user.firstName = item.firstname
            user.lastName = item.lastname
            return user
          })
        })
      } catch (err: any) {
        console.log('Erro: ' + JSON.stringify(err))
        return Promise.reject(new InternalServerError())
      }
    }
}
