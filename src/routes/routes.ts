import { User } from '@/feature/user/domain/entities/User'
import { LoginUseCase } from '@/feature/user/domain/use-cases/login.use-case'
import { RegisterUseCase } from '@/feature/user/domain/use-cases/register.use-case'
import { isHttpError } from '@curveball/http-errors/dist'
import { NextFunction, Request, Response, Router } from 'express'

const router = Router()

// Application routing
router.get('/', (req: Request, res: Response) => {
  res.status(200).send({ data: 'Hello world' })
})

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  const registerUseCase = new RegisterUseCase()

  const user = new User()
  user.username = req.body.username
  user.password = req.body.password
  user.firstName = req.body.firstName
  user.lastName = req.body.lastName
  user.age = req.body.age

  try {
    const id = await registerUseCase.register(user)
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

router.get('/login', async (req: Request, res: Response, next: NextFunction) => {
  const loginUseCase = new LoginUseCase()

  const user = new User()
  user.username = req.body.username
  user.password = req.body.password

  try {
    const result = await loginUseCase.login(user)
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

export default router
