const express = require('express');
const bcrypt = require('bcrypt');
const { User, Chat, Post } = require('../models');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.post('/login', isNotLoggedIn, (req, res, next) => { // middleware 확장하는 방법
  passport.authenticate('local', (err, user, info) => {
   if (err) {  // 서버 에러
     console.error(err);
     return next(err);
   }
   if (info) {  // 클라이언트 에러
     return res.status(401).send(info.reason);
   }
   return req.login(user, async (loginError) => {
     if (loginError) {
       console.error(loginError);
       return next(loginError);
     }
     const fullUserWithoutPassword = await User.findOne({
       where: { id: user.id },
       attributes: {
         exclude: ['password']
       },
       include: [{
         model: Post, // db associate 관계
       }, {
         model: Chat,
       }]
     })
     return res.status(200).json(fullUserWithoutPassword);
   })
 })(req, res, next);
});

router.post('/', isNotLoggedIn, async (req, res, next) => {  // POST /user/
  try{
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
  try{
    const exUser = await User.findOne({
      where: {
        userid: req.body.id,
      }
    });
    if (exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다.');
    }
    res.status(200).send('아이디 사용 가능');
  } catch(error) {
      console.error(error);
      next(error);
    }
  });

  router.post('/logout', (req, res) => {
    req.logout();
    req.session.destroy();
    res.send('ok');
  });

module.exports = router;