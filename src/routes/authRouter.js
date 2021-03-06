const express = require('express')
const authRouter = express.Router()

const User = require('../models/users')
const Role = require('../models/roles')
const basicAuth = require('../middleware/basicAuth')
const bearerAuth = require('../middleware/bearerAuth')
const acl = require('../middleware/accessControlList')

const secret = []

authRouter.post('/signup', async (req, res, next) => {
  // expects the user sent a req body with username and password
  // and name of role. find the right role, save the user
  // take that username and password and make a new user with it
  req.body.role = await Role.findOne({ name: req.body.role })
  const user = new User(req.body)
  user.save()
    .then(result => res.status(200).json({ token: user.generateToken() }))
    .catch(next)
})

authRouter.post('/signin', basicAuth, (req, res, next) => {
  res.status(200).json({ token: req.token })
})

authRouter.get('/secret', bearerAuth, acl('read'), (req, res, next) => {
  res.status(200).json(req.user)
})

authRouter.post('/secret', bearerAuth, acl('create'), (req, res, next) => {
  secret.push(req.body)
  res.status(200).json(req.user)
})

authRouter.get('/users', async (req, res, next) => {
  // send all users
  const allUsers = await User.find({})
  res.status(200).json(allUsers)
})

module.exports = authRouter
