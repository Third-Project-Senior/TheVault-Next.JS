// models/user.js
module.exports = (connection, DataTypes) => {
    const User = connection.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'user',
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-978409_1280.png',
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'active',
    },
    history: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: true,
        defaultValue: [],
    },    
    })
    return User;
}