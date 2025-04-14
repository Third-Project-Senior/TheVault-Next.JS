module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    return Comment;
  };
  