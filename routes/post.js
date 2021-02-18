const express = require('express');

const router = express.Router();
const { Post } = require('../models');
const { getImageSrc } = require('../api/getImageSrc');

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
      ownerid: 1,
      User: req.body.User,
    });
    res.status(201).send(imgSrc);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;