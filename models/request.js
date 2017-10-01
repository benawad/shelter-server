export default (sequelize, Sequelize) => {
  const Request = sequelize.define('request', {
    rooms: Sequelize.INTEGER,
  });

  return Request;
};
