var bcrypt = require('bcryptjs');
var _ = require('underscore');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        // title: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [4, 100]
            },
            set: function (value) {
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);

                // store salt in database, however password is not stored because it's DataTypes.VIRTUAL
                this.setDataValue('password', value);
                this.setDataValue('salt', salt);
                this.setDataValue('password_hash', hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function (user, options) {
                if (typeof user.email === 'string') {
                    user.email = user.email.toLowerCase();
                }
            }
        },
        instanceMethods: {
            toPublicJSON: function () {
                var json = this.toJSON(); // this = instance
                return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
            }
        }
    }
);
};
