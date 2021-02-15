const axios = require('axios');
const cheerio = require('cheerio');

const getImageSrc = async (url) => {
  return axios.get(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      if ($('meta[property="og:image:url"]').attr('content') === undefined) {
        console.log($('meta[property="og:image"]').attr('content'));
        return $('meta[property="og:image"]').attr('content');
      } else {
        console.log($('meta[property="og:image:url"]').attr('content'));
        return $('meta[property="og:image:url"]').attr('content');
      }
    })
    .catch((err) => console.log(err));
};

// const url = 'https://cookatmarket.com/ko/product/detail?product_id=576';
// const a = getImageSrc(url);

module.exports = { getImageSrc };
