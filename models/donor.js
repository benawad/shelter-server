export default (sequelize, DataTypes) => {
  const Donor = sequelize.define('donor', {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
  });

  Donor.associate = (models) => {
    Donor.hasMany(models.Shelter);
  };

  return Donor;
};
