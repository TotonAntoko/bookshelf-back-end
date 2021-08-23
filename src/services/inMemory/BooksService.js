const { nanoid } = require('nanoid')
const NotFoundError = require('../../exceptions/NotFoundError')
const InvariantError = require('../../exceptions/InvariantError')

class BooksService {
  constructor () {
    this._books = []
  }

  async addBook ({
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  }) {
    const id = `book-${nanoid(16)}`
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const finished = pageCount === readPage

    const newBooks = {
      id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    if (readPage > pageCount) {
      throw new InvariantError('Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount')
    }

    this._books.push(newBooks)
    return newBooks.id
  }

  async getBooks ({ name, reading, finished }) {
    const filterBooksByName = this._books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const filterBooksByReading = this._books.filter((book) => book.reading === Boolean(Number(reading)))
    const filterBooksByFinished = this._books.filter((book) => book.finished === Boolean(Number(finished)))

    const mapBooks = (books) => {
      return books.map((book) => {
        const { id, name, publisher } = book
        return {
          id: id,
          name: name,
          publisher: publisher
        }
      })
    }
    return mapBooks((
      name !== '')
      ? filterBooksByName
      : (reading !== '')
          ? filterBooksByReading
          : (finished !== '') ? filterBooksByFinished : this._books)
  }

  async getBookById (id) {
    const result = this._books.filter(book => book.id === id)[0]
    if (result === undefined) {
      throw new NotFoundError('Buku tidak ditemukan')
    }

    return result
  }

  async editBookById (id, { name, year, author, summary, publisher, pageCount, readPage, reading }) {
    const index = this._books.findIndex((book) => book.id === id)

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui buku. Id tidak ditemukan')
    }

    if (readPage > pageCount) {
      throw new InvariantError('Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount')
    }
    this._books[index] = {
      ...this._books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading
    }
  }

  async deleteBookById (id) {
    const index = this._books.findIndex((book) => book.id === id)

    if (index === -1) {
      throw new NotFoundError('Buku gagal dihapus. Id tidak ditemukan')
    }
    this._books.splice(index, 1)
  }
}

module.exports = BooksService
