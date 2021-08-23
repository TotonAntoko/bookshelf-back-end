const ClientError = require('../../exceptions/ClientError')

class BooksHandler {
  constructor (service, validator) {
    this._service = service // It will be handle to process send data to database.
    this._validator = validator // Validation data

    this.postBookHandler = this.postBookHandler.bind(this)
    this.getBooksHandler = this.getBooksHandler.bind(this)
    this.getBookByIdHandler = this.getBookByIdHandler.bind(this)
    this.putBookByIdHandler = this.putBookByIdHandler.bind(this)
    this.deleteBookByIdHanlder = this.deleteBookByIdHanlder.bind(this)
  }

  async postBookHandler (request, h) {
    try {
      this._validator.validatePostBookPayload(request.payload)

      const {
        name, year, author, summary, publisher, pageCount, readPage, reading
      } = request.payload

      const bookId = await this._service.addBook({
        name, year, author, summary, publisher, pageCount, readPage, reading
      })

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId
        }
      })

      response.code(201)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      if (error instanceof Error) {
        const response = h.response({
          status: 'error',
          message: error.output.payload.message
        })
        response.code(error.output.statusCode)

        if (error.output.statusCode === 500) {
          console.error(error)
        }
        return response
      }
    }
  }

  async getBooksHandler (request) {
    const { name = '', reading = '', finished = '' } = request.query
    const books = await this._service.getBooks({ name, reading, finished })
    return {
      status: 'success',
      data: {
        books: books
      }
    }
  }

  async getBookByIdHandler (request, h) {
    try {
      const { bookId } = request.params
      const book = await this._service.getBookById(bookId)

      return {
        status: 'success',
        data: {
          book
        }
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      if (error instanceof Error) {
        const response = h.response({
          status: 'error',
          message: error.output.payload.message
        })
        response.code(error.output.statusCode)

        if (error.output.statusCode === 500) {
          console.error(error)
        }
        return response
      }
    }
  }

  async putBookByIdHandler (request, h) {
    try {
      this._validator.validatePutBookPayload(request.payload)

      const { bookId } = request.params
      const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

      await this._service.editBookById(bookId, {
        name, year, author, summary, publisher, pageCount, readPage, reading
      })

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui'
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      if (error instanceof Error) {
        const response = h.response({
          status: 'error',
          message: error.output.payload.message
        })
        response.code(error.output.statusCode)

        if (error.output.statusCode === 500) {
          console.error(error)
        }
        return response
      }
    }
  }

  async deleteBookByIdHanlder (request, h) {
    try {
      const { bookId } = request.params
      await this._service.deleteBookById(bookId)

      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus'
      })
      response.code(200)
      return response
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message
        })
        response.code(error.statusCode)
        return response
      }

      if (error instanceof Error) {
        const response = h.response({
          status: 'error',
          message: error.output.payload.message
        })
        response.code(error.output.statusCode)

        if (error.output.statusCode === 500) {
          console.error(error)
        }
        return response
      }
    }
  }
}

module.exports = BooksHandler
