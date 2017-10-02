export default (sequelize, Sequelize) => {
  const Request = sequelize.define('request', {
    rooms: Sequelize.INTEGER,
    touched: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    accepted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    viewed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  return Request;
};
