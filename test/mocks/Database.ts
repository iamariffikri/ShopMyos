import { DatabaseType } from '../../src/providers/Database'

export default class MockDatabase implements DatabaseType {
  databaseName: string
  queryString: string

  getConnection(database: string) {
    this.databaseName = database

    return {
      query: (sql, done) => {
        this.queryString = sql
        done(undefined, { insertId: 1 })
      },
    }
  }
  connect(database: string) {
    return {}
  }
  dropConnection() {
    return {}
  }
}
