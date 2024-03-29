exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next(); // parameter 있으면 에러처리 , 없으면 다음 middleware로 이동
  } else {
    return res.status(402).send('로그인이 필요합니다.');
  }
}

exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    return res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
  }
}