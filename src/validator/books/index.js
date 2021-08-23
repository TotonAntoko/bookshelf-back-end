const { PostBookPayloadSchema, PutBookPayloadSchema } = require('./schema')
const InvariantError = require('../../exceptions/InvariantError')

const BooksValidator = {
  validatePostBookPayload: (payload) => {
    const validationResult = PostBookPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  },

  validatePutBookPayload: (payload) => {
    const validationResult = PutBookPayloadSchema.validate(payload)
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message)
    }
  }
}

module.exports = BooksValidator
