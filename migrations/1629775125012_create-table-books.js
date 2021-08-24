/* eslint-disable camelcase */
exports.up = pgm => {
  pgm.createTable('books', {
    id: {
      type: 'VARCHAR',
      primaryKey: true,
      notNull: true
    },
    name: {
      type: 'VARCHAR',
      notNull: true
    },
    year: {
      type: 'INTEGER',
      notNull: true
    },
    author: {
      type: 'VARCHAR',
      notNull: true
    },
    summary: {
      type: 'VARCHAR',
      notNull: true
    },
    publisher: {
      type: 'VARCHAR',
      notNull: true
    },
    pageCount: {
      type: 'INTEGER',
      notNull: true
    },
    readPage: {
      type: 'INTEGER',
      notNull: true
    },
    finished: {
      type: 'BOOL',
      notNull: true
    },
    reading: {
      type: 'BOOL',
      notNull: true
    },
    created_at: {
      type: 'VARCHAR',
      notNull: true
    },
    updated_at: {
      type: 'VARCHAR',
      notNull: true
    }
  })
}

exports.down = pgm => {
  pgm.dropTable('books')
}
