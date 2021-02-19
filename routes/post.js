const express = require('express');

const router = express.Router();
const { Post } = require('../models');
const { getImageSrc } = require('../api/getImageSrc');
const { isLoggedIn } = require('./middlewares');

router.post('/add', async (req, res, next) => {
  try {
    console.log(req.body);
    const imgSrc = await getImageSrc(req.body.link);
    console.log(imgSrc);
    await Post.create({
      title: req.body.title,
      personnel: req.body.personnel,
      curPersonnel: req.body.curPersonnel,
      from: req.body.from,
      to: req.body.to,
      price: req.body.price,
      location: req.body.location,
      link: req.body.link,
      img: imgSrc,
      textArea: req.body.textArea,
      UserId: req.user.id,
    });
    res.status(201).send(imgSrc);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:postId/in', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    // personnel handling

    await post.addParticipants(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id })
  } catch (error) {
    console.error(error);
    next(error);
  }
})

module.exports = router;