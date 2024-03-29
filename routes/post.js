const express = require('express');

const router = express.Router();
const { Post, User, Hashtag, Report } = require('../models');
const { getImageSrc } = require('../api/getImageSrc');
const { isLoggedIn } = require('./middlewares');

router.post('/add', async (req, res, next) => {
  try {
    const hashtags = req.body.textArea.match(/#[^\s]+/g);
    console.log(req.body);
    const imgSrc = await getImageSrc(req.body.link);
    console.log(imgSrc);
    const post = await Post.create({
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
      isDivide: req.body.isDivide,
      isReported: req.body.isReported,
      UserId: req.user.id,
    });
    if (hashtags) {
      const uniquetags = [...new Set(hashtags)];
      const result = await Promise.all(uniquetags.map((tag) => Hashtag.findOrCreate({
        where: { content: tag.slice(1).toLowerCase() }
      })));
      await post.addHashtags(result.map((v) => v[0]));
    }
    await post.addParticipants(req.user.id);
    const target = await Post.findOne({
      where: {
        id: post.id,
      },
      include: [{
        model: User,
        as: 'Participants',
        attributes: ['id', 'userid'],
      }, {
        model: Hashtag,
        attributes: ['id', 'content'],
      }]
    })
    res.status(201).send(target);
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
    await post.addParticipants(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id })
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete('/:postId/out', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId }
    });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeParticipants(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id })
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { 
        id: req.params.postId,
      },
    });
    res.status(200).json({ postId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.post('/report', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.update({
      isReported: true,
    }, {
      where: { 
        id: req.body.postId,
      },
    });
    await Report.create({
      title: req.body.title,
      reason: req.body.reason,
      UserId: req.user.id,
      PostId: req.body.postId,
    })
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.post('/:postId/report', async (req, res, next) => {
  try {
    const reports = await Report.findAll({
      where: { 
        PostId: req.params.postId,
      },
      attributes: {
        exclude: ['reason', 'createdAt', 'updatedAt', 'UserId']
      },
    });
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.patch('/modify', isLoggedIn, async (req, res, next) => {
  try {
    const imgSrc = await getImageSrc(req.body.link);
    const newHashtags = req.body.textArea.match(/#[^\s]+/g);
    const oldpost = await Post.findOne({
      where: {
        id: req.body.postId,
      }
    })
    const oldHashtags = await oldpost.getHashtags();
    console.log('*** oldhashtag: ', oldHashtags);
    await Post.update({
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
      isDivide: req.body.isDivide,
    }, {
      where: { id: req.body.postId },
    });

    // if (hashtags) {
    //   const uniquetags = [...new Set(hashtags)];
    //   const result = await Promise.all(uniquetags.map((tag) => Hashtag.findOrCreate({
    //     where: { content: tag.slice(1).toLowerCase() }
    //   })));
    //   await post.addHashtags(result.map((v) => v[0]));
    // }
    const target = await Post.findOne({
      where: {
        id: req.body.postId,
      },
      include: [{
        model: User,
        as: 'Participants',
        attributes: ['id', 'userid'],
      }, {
        model: Hashtag,
        attributes: ['id', 'content'],
      }]
    })
    res.status(200).send(target);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;