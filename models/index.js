import Sequelize from 'sequelize';

const sequelize = new Sequelize('shelter', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
});

const db = {
  Shelter: sequelize.import('./shelter'),
  Donor: sequelize.import('./donor'),
  Guest: sequelize.import('./guest'),
  Request: sequelize.import('./request'),
};

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
// db.Sequelize = Sequelize;

export default db;
