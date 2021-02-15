const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {  // POST /user/
  try {
    const exUser = await User.findOne({
      where: {
        userid: req.body.id,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await User.create({
      userid: req.body.id,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send('OK');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/checkid', async (req, res, next) => {  // POST /user/checkid
  try {
    const exUser = await User.findOne({
      where: {
        userid: req.body.id,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    res.status(200).send('아이디 사용 가능');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;