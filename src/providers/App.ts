import * as path from 'path'
import * as dotenv from 'dotenv'

import Express from './Express'
import Database from './Database'

class App {
  // Loads your dotenv file
  public loadConfiguration(): void {
    console.info('Configuration :: Booting @ Master...')

    dotenv.config({ path: path.join(__dirname, '../../.env') })
  }

  // Loads your Server
  public loadServer(): void {
    console.info('Server :: Booting up...')

    Express.init()
  }

  // Loads the Database Pool
  public async loadDatabase() {
    console.info('Database :: Booting @ Master...')

    const database = new Database()
    database.connect('myos-ecommerce')
  }
}

export default new App()
