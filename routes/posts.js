const express = require('express');

const router = express.Router();
const { Op } = require("sequelize");
const { Post } = require('../models');

router.post('/', async (req, res, next) => {
  try {
    console.log('리퀘스트 바디: ', req.body);
    const lastPage = req.body.pageData || await Post.count({}) + 1;
    const postsData = await Post.findAll({
      where: {
        id: {
          [Op.lt]: [lastPage],
        }
      },
      limit: 10,
      order: [['createdAt', 'DESC']],
    });
    const lastId = postsData[postsData.length - 1].id;
    res.status(201).send({ posts: postsData, lastId });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;