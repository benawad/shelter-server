export default {
  Query: {
    fields: {
      // getBook: {
      //   where: (table, empty, args) => `${table}.id = ${args.id}`,
      // },
      // allBooks: {
      //   limit: (table, { limit }) => limit,
      //   orderBy: 'id',
      //   where: (table, empty, { key }) => `${table}.id > ${key}`,
      // },
    },
  },
  Donor: {
    sqlTable: 'donors',
    uniqueKey: 'id',
  },
  Shelter: {
    sqlTable: 'shelters',
    uniqueKey: 'id',
  },
};
