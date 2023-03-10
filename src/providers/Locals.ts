import { Application } from 'express'
import * as path from 'path'
import * as dotenv from 'dotenv'

class Locals {
  /**
   * Makes env configs available for your app
   * throughout the app's runtime
   */
  public static config(): any {
    dotenv.config({ path: path.join(__dirname, '../../.env') })

    const url = process.env.APP_URL || `http://localhost:${process.env.PORT}`
    const port = process.env.PORT || 4040

    const dbHost = process.env.DB_HOST || '127.0.0.1'
    const dbUser = process.env.DB_USER || 'root'
    const dbName = process.env.DB_NAME || 'db'
    const dbPassword = process.env.DB_PASSWORD || 'admin'

    return {
      url,
      port,
      dbHost,
      dbUser,
      dbName,
      dbPassword,
    }
  }

  /**
   * Injects your config to the app's locals
   */
  public static init(_express: Application): Application {
    _express.locals.app = this.config()
    return _express
  }
}

export default Locals
