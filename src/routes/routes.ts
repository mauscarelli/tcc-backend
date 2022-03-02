import { Classroom } from '@/feature/classroom/domain/entities/classroom'
import { JoinRequest } from '@/feature/classroom/domain/entities/joinRequest'
import { CreateClassroomUseCase } from '@/feature/classroom/domain/use-cases/create-classroom.use-case'
import { JoinClassroomUseCase } from '@/feature/classroom/domain/use-cases/join-classroom.use-case'
import { User } from '@/feature/user/domain/entities/user'
import { LoginUseCase } from '@/feature/user/domain/use-cases/login.use-case'
import { RegisterUseCase } from '@/feature/user/domain/use-cases/register.use-case'
import { isHttpError } from '@curveball/http-errors/dist'
import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

// Application routing
router.get('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello world' })
})

router.post('/user/createAccount', async (req: Request, res: Response, next: NextFunction) => {
  const registerUseCase = new RegisterUseCase()

  const user = new User()
  user.username = req.body.username
  user.password = req.body.password
  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.age = req.body.age

  try {
    const id = await registerUseCase.execute(user)
    res.status(200).send({ success: true, id: id })
  } catch (e) {
    if (isHttpError(e)) {
      next({
        status: e.httpStatus,
        message: e.message,
        stack: e.stack
      })
    }
    next(e)
  }
})

router.get('/user/login', async (req: Request, res: Response, next: NextFunction) => {
  const loginUseCase = new LoginUseCase()

  const user = new User()
  user.username = req.body.username
  user.password = req.body.password

  try {
    const result = await loginUseCase.execute(user)
    res.status(200).send({ success: true, data: result })
  } catch (e) {
    if (isHttpError(e)) {
      next({
        status: e.httpStatus,
        message: e.message,
        stack: e.stack
      })
    }
    next(e)
  }
})

router.post('/classroom/create', async (req: Request, res: Response, next: NextFunction) => {
  const createClassroomUseCase = new CreateClassroomUseCase()

  const classroom = new Classroom()
  classroom.schoolName = req.body.schoolName
  classroom.className = req.body.className
  classroom.professorId = req.body.professorId

  try {
    const id = await createClassroomUseCase.execute(classroom)
    res.status(200).send({ success: true, id: id })
  } catch (e) {
    if (isHttpError(e)) {
      next({
        status: e.httpStatus,
        message: e.message,
        stack: e.stack
      })
    }
    next(e)
  }
})

router.post('/classroom/join', async (req: Request, res: Response, next: NextFunction) => {
  const joinClassroomUseCase = new JoinClassroomUseCase()

  const joinRequest = new JoinRequest()
  joinRequest.studentId = req.body.userId
  joinRequest.classroomId = req.body.classroomId

  try {
    await joinClassroomUseCase.execute(joinRequest)
    res.status(200).send({ success: true })
  } catch (e) {
    if (isHttpError(e)) {
      next({
        status: e.httpStatus,
        message: e.message,
        stack: e.stack
      })
    }
    next(e)
  }
})

export default router
