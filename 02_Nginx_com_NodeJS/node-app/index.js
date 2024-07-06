const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const connectionConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
}

function handleDisconnect() {
  const connection = mysql.createConnection(connectionConfig)

  connection.connect(err => {
    if (err) {
      console.error('error connecting: ' + err.stack)
      setTimeout(handleDisconnect, 2000)
    } else {
      console.log('connected as id ' + connection.threadId)

      const createTable = `
        CREATE TABLE IF NOT EXISTS people (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
        )
      `

      connection.query(createTable, (err, results) => {
        if (err) throw err
        console.log('Table created or already exists')
      })
    }
  })

  connection.on('error', err => {
    console.error('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect()
    } else {
      throw err
    }
  })

  app.get('/', (req, res) => {
    const insertQuery = `INSERT INTO people (name) VALUES ('Full Cycle')`

    connection.query(insertQuery, (err, results) => {
      if (err) throw err

      connection.query('SELECT * FROM people', (err, results) => {
        if (err) throw err

        const namesList = results
          .map(person => `<li>${person.name}</li>`)
          .join('')
        res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`)
      })
    })
  })
}

handleDisconnect()

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
