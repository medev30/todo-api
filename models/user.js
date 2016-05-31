module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        title: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 100]
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeOf (user.email) === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        }
    });
};
