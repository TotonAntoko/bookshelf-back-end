const { Pool } = require('pg')
const { nanoid } = require('nanoid')

const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')

class BooksService {
  constructor () {
    this._pool = new Pool()
  }

  async addBook ({
    name, year, author, summary, publisher, pageCount, readPage, reading
  }) {
    const id = `book-${nanoid(16)}`
    const insertedAt = new Date().toISOString()

    const finished = pageCount === readPage

    const query = {
      text: 'INSERT INTO books VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $11) RETURNING id',
      values: [id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt]
    }

    if (readPage > pageCount) {
      throw new InvariantError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')
    }

    const result = await this._pool.query(query)

    if (!result.rows[0].id) {
      throw new InvariantError('Buku gagal ditambahkan')
    }

    return result.rows[0].id
  }

  async getBooks ({ name, reading, finished }) {
    const results = await this._pool.query('SELECT * FROM books')
    const books = results.rows

    const filterBooksByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const filterBooksByReading = books.filter((book) => book.reading === Boolean(Number(reading)))
    const filterBooksByFinished = books.filter((book) => book.finished === Boolean(Number(finished)))

    const mapBooksDBToModel = (books) => (
      books.map((book) => {
        const { id, name, publisher } = book
        return {
          id: id,
          name: name,
          publisher: publisher
        }
      })
    )

    return mapBooksDBToModel(
      (name !== '')
        ? filterBooksByName
        : (reading !== '')
            ? filterBooksByReading
            : (finished !== '')
                ? filterBooksByFinished
                : books)
  }

  async getBookById (id) {
    const query = {
      text: 'SELECT * FROM books WHERE id = $1',
      values: [id]
    }

    const result = await this._pool.query(query)
    const book = result.rows

    if (!book.length) {
      throw new NotFoundError('Buku tidak ditemukan')
    }

    const mapBooksDBToModel = (books) => (
      books.map((book) => {
        const { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, created_at, updated_at } = book
        return {
          id,
          name,
          year,
          author,
          summary,
          publisher,
          pageCount,
          readPage,
          finished,
          reading,
          insertedAt: created_at,
          updatedAt: updated_at
        }
      })
    )

    return mapBooksDBToModel(book)[0]
  }

  async editBookById (id, {
    name, year, author, summary, publisher, pageCount, readPage, reading
  }) {
    const updatedAt = new Date().toISOString()
    const query = {
      text: 'UPDATE books SET name = $1, year = $2, author = $3, summary = $4, publisher = $5, pageCount = $6, readPage = $7, reading = $8, updated_at = $9 WHERE id = $10 RETURNING id',
      values: [name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt, id]
    }

    if (readPage > pageCount) {
      throw new InvariantError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan')
    }
  }

  async deleteBookById (id) {
    const query = {
      text: 'DELETE FROM books WHERE id = $1 RETURNING id',
      values: [id]
    }

    const result = await this._pool.query(query)

    if (!result.rows.length) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan')
    }
  }
}

module.exports = BooksService
