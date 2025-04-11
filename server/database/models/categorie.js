module.exports =(connection, DataTypes) => {
    const Category = connection.define('Category', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
    });
    return Category;
}