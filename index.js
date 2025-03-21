const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Trang chủ')
})

app.get('/tour', (req, res) => {
  res.send('Danh sách tour')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})