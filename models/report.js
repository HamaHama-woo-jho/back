module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    title: {
      type: DataTypes.INTEGER,
      allowNull: false,
  }, reason: {
      type: DataTypes.TEXT,
      allowNull: true,
  },
  },{
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci', // 이모티콘 저장
  });
  Report.associate = (db) => {
    db.Report.belongsTo(db.User);
    db.Report.belongsTo(db.Post);
  };
  return Report;
}