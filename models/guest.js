export default (sequelize, DataTypes) => {
  const Guest = sequelize.define('guest', {
    name: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
    },
  });

  Guest.associate = (models) => {
    Guest.belongsToMany(models.Shelter, {
      through: models.Request,
      foreignKey: 'guestId',
    });
  };

  return Guest;
};
