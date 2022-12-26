import * as express from 'express'
import * as bodyParser from 'body-parser'

import apiRouter from './Routes'
import Locals from './Locals'

class Express {
  public express: express.Application

  constructor() {
    this.express = express()

    this.mountDotEnv()
    this.mountRequestBodyParser()
    this.mountRoutes()
  }

  private mountDotEnv(): void {
    this.express = Locals.init(this.express)
  }

  private mountRoutes(): void {
    this.express.use(apiRouter)
  }

  private mountRequestBodyParser(): void {
    this.express.use(bodyParser.json())
  }

  /**
   * Starts the express server
   */
  public init(): any {
    const port: number = Locals.config().port

    // Start the server on the specified port
    this.express
      .listen(port, () => {
        return console.log(
          '\x1b[33m%s\x1b[0m',
          `Server :: Running @ 'http://localhost:${port}'`
        )
      })
      .on('error', (_error) => {
        return console.log('Error: ', _error.message)
      })
  }
}

/** Export the express module */
export default new Express()
