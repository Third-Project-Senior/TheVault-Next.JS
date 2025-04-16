module.exports = (connection, DataTypes) => {
    const Category = connection.define('Category', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    });
    return Category;
}