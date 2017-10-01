export default (sequelize, DataTypes) => {
  const Shelter = sequelize.define('shelter', {
    name: {
      type: DataTypes.STRING,
    },
    occupancy: {
      type: DataTypes.INTEGER,
    },
    shower: {
      type: DataTypes.BOOLEAN,
    },
    food: {
      type: DataTypes.BOOLEAN,
    },
    address: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(5000),
    },
    pictureUrl: {
      type: DataTypes.STRING,
    },
  });

  Shelter.associate = (models) => {
    Shelter.belongsToMany(models.Guest, {
      through: models.Request,
      foreignKey: 'shelterId',
    });
  };

  return Shelter;
};
