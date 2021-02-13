const express = require('express');
const userRouter = require('./routes/user');
const db = require('./models');
const app = express();

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공!');
  })
  .catch(console.error);

app.get('/', (req, res) => {
  res.send('hello express');
});

app.use('/user', userRouter);

app.listen(3066, () => {
  console.log('서버 실행 중');
});