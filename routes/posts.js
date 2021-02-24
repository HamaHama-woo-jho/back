const express = require('express');

const router = express.Router();
const { Op } = require("sequelize");
const { Post, User, Hashtag } = require('../models');

router.post('/', async (req, res, next) => {
  try {
    console.log('리퀘스트 바디: ', req.body);
    const lastPage = req.body.pageData || await Post.findOne({
      order: [['createdAt', 'DESC']],
      raw: true,
    }).then((p) => p.id) + 1;
    console.log('마지막 페이지: ', await Post.findOne({ order: [['createdAt', 'DESC']], raw: true }).then((p) => p.id));
    const postsData = await Post.findAll({
      where: {
        id: {
          [Op.lt]: [lastPage],
        }
      },
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'Participants',
        attributes: ['id', 'userid'],
      }, {
        model: Hashtag,
        attributes: ['id', 'content'],
      }]
    });
    const lastId = postsData[postsData.length - 1].id;
    res.status(201).send({ posts: postsData, lastId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;