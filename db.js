var mysql2 = require('mysql2')
var connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root', 
  password: 'root', 
  database: 'task',
  port: 3307,
})
connection.connect((err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Database connected')
})

module.exports = connection;