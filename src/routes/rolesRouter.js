const express = require('express')
const rolesRouter = express.Router()

const Role = require('../models/roles')
const basicAuth = require('../middleware/basicAuth')
const bearerAuth = require('../middleware/bearerAuth')

rolesRouter.get('/roles', async (req, res, next) => {
  // all roles
  const allRoles = await Role.find({})
  res.status(200).json(allRoles)
})

rolesRouter.post('/roles', async (req, res, next) => {
  // expects the user sent a properly req body
  // with the name:String and permission:String
  const role = new Role(req.body)
  await role.save()
    .then(result => res.status(200).json({ role }))
    .catch(next)
})

module.exports = rolesRouter
