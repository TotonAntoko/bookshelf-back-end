const routes = (handle) => [
  {
    method: 'POST',
    path: '/books',
    handler: handle.postBookHandler
  },
  {
    method: 'GET',
    path: '/books',
    handler: handle.getBooksHandler
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handle.getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handle.putBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: handle.deleteBookByIdHanlder
  }
]

module.exports = routes
