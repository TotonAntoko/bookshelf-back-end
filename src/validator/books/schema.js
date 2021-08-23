const Joi = require('joi')

const PostBookPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Gagal menambahkan buku. Mohon isi nama buku'
  }),
  year: Joi.number().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().required(),
  readPage: Joi.number().required(),
  reading: Joi.bool().required()
})

const PutBookPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Gagal memperbarui buku. Mohon isi nama buku'
  }),
  year: Joi.number().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().required(),
  readPage: Joi.number().required(),
  reading: Joi.bool().required()
})

module.exports = { PostBookPayloadSchema, PutBookPayloadSchema }
