module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    roomid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });
  Chat.associate = (db) => {
    db.Chat.belongsTo(db.User);
    db.Chat.belongsTo(db.Post);
  };
  return Chat;
}