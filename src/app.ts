import Server from './server'
import { appPort } from './shared/envSearch'

const port = appPort() || 3000

const starter = new Server().start(port)
  .then(port => console.log(`Running on port ${port}`))
  .catch(error => {
    console.log(error)
  })

export default starter
