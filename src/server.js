const Hapi = require('@hapi/hapi')

// Books
const books = require('./api/books')
const BooksService = require('./services/inMemory/BooksService')
const BooksValidator = require('./validator/books')

const init = async () => {
  const booksService = new BooksService()

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
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
