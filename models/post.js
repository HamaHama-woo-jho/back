module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    personnel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    curPersonnel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    img: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    textArea: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDivide: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    ownerid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.hasMany(db.Chat);
    db.Post.belongsToMany(db.User, { through: 'Chatroom', as: 'Participant' });
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
  };
  return Post;
}