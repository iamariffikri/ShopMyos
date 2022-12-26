import * as mysql from 'mysql'
import Locals from './Locals'

class Database {
  host: string
  user: string
  password: string
  establishedConnection: any
  connection: any
  dbName: any

  // Initialize your database pool
  constructor() {
    const config = Locals.config()
    this.host = config.dbHost
    this.dbName = config.dbName
    this.user = config.dbUser
    this.password = config.dbPassword
  }

  getConnection(database: string) {
    if (this.connection) return this.connection
    // return new Promise((resolve, reject) => {
    this.connection = mysql.createConnection({
      host: this.host,
      user: this.user,
      password: this.password,
      database,
    })
    return this.connection
  }

  connect(database: string) {
    if (this.establishedConnection) return
    this.connection = this.getConnection(database)
    this.establishedConnection = this.connection.connect(function (err) {
      if (!err) return
      console.error('Unable to connect to DB: ', err)
      this.dropConnection()
      throw err
    })
  }

  dropConnection() {
    if (!this.establishedConnection) return
    this.establishedConnection.then((res) => {
      res.end()
      console.log(res.state, 'connection dropped')
    })

    this.establishedConnection = null
  }
}

export default Database
