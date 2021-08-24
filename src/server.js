require('dotenv').config()

const Hapi = require('@hapi/hapi')

// Books
const books = require('./api/books')
const BooksService = require('./services/postgres/BooksService')
const BooksValidator = require('./validator/books')

const init = async () => {
  const booksService = new BooksService()

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : process.env.HOST,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  })

  await server.register([
    {
      plugin: books,
      options: {
        service: booksService,
        validator: BooksValidator
      }
    }
  ])

  await server.start()
  console.log(`Server berjalan pada ${server.info.uri}`)
}

init()
