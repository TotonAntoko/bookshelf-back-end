const { nanoid } = require('nanoid')
const books = require('./books')

const AddBookHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload

    const id = nanoid(16)
    const insertedAt = new Date().toISOString()
    const updatedAt = insertedAt

    const finished = pageCount === readPage

    const newBooks = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }

    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    } else {
        books.push(newBooks)
    }

    const isSuccess = books.filter((book) => book.id === id).length > 0
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        response.code(201)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal ditambahkan'
    })
    response.code(500)
    return response
}

const getAllBooksHandler = (request, h) => {
    const { name = '', reading = '', finished = '' } = request.query
    const filterBooksByName = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const filterBooksByReading = books.filter((book) => book.reading === Boolean(Number(reading)))
    const filterBooksByFinished = books.filter((book) => book.finished === Boolean(Number(finished)))
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

    const response = h.response({
        status: 'success',
        data: {
            books: mapBooks((
                name !== '')
                ? filterBooksByName
                : (reading !== '')
                    ? filterBooksByReading
                    : (finished !== '') ? filterBooksByFinished : books)
        }
    })
    return response
}

const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params
    const book = books.filter((book) => book.id === bookId)[0]

    if (book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    response.code(404)
    return response
}

const editBookByIdHandler = (request, h) => {
    const { bookId } = request.params
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload
    let index

    if (name == null) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400)
        return response
    } else if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400)
        return response
    } else {
        index = books.findIndex((book) => book.id === bookId)
    }

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading
        }
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        response.code(200)
        return response
    }
    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

const deleteBookByIdHanlder = (request, h) => {
    const { bookId } = request.params
    const index = books.findIndex((book) => book.id === bookId)

    if (index !== -1) {
        books.splice(index, 1)
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        response.code(200)
        return response
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    response.code(404)
    return response
}

module.exports = { AddBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHanlder }
