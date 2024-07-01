const express = require('express')
const mysql = require('mysql')
const app = express()
const port = 3000

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

connection.connect(err => {
  if (err) throw err
  console.log('Connected to MySQL')
})

app.get('/', (req, res) => {
  const name = 'Full Cycle'
  connection.query(`INSERT INTO people (name) VALUES ('${name}')`, err => {
    if (err) throw err

    connection.query('SELECT * FROM people', (err, results) => {
      if (err) throw err

      const names = results.map(row => `<li>${row.name}</li>`).join('')
      res.send(`<h1>Full Cycle Rocks!</h1><ul>${names}</ul>`)
    })
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
