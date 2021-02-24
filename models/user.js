module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', { // MySQL: users 테이블 생성됨
    // id가 기본적으로 들어있다. (mysql에서 자동 생성함)
    userid: {
      type: DataTypes.STRING(8),
      allowNull: false, // 필수
      unique: true, // 고유한 값
    },
    nickname: {
      type: DataTypes.STRING(8),
      allowNull: false, // 필수
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false, // 필수
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', // 한글 저장
  });
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Chat);
    db.User.belongsToMany(db.Post, { through: 'Chatroom', as: 'Participated' });  // 중간: table 이름
    db.User.hasMany(db.Report);
  };
  return User;
}