'use strict'

module.exports = (User) => {

  User.createUser = (email, password, name, lastName, dni, roleId, cb) => {

    let RoleMapping = User.app.models.RoleMapping
    let Role = User.app.models.Role

    var saveUsuario = new Promise((resolve, reject) => {
      let user = {
        email: email,
        password: password,
        name: name,
        lastName: lastName,
        dni: dni
      }

      User.create(user, (err, user) => {
        if (err) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    })

    saveUsuario.then(user => {
      Role.findOne({
        where: {
          id: roleId
        }
      }, (err, role) => {
        role
          .principals
          .create({
            principalType: RoleMapping.USER,
            principalId: user.id
          }, (err, principal) => {
            if (err) {
              cb(err)
            } else {
              cb(null, user)
            }
          })
      })
    })
  }

  User.remoteMethod('createUser', {
    accepts: [
      {
        arg: 'email',
        type: 'string',
        required: true
      }, {
        arg: 'password',
        type: 'string',
        required: true
      }, {
        arg: 'name',
        type: 'string',
        required: true
      }, {
        arg: 'lastName',
        type: 'string',
        required: true
      }, {
        arg: 'dni',
        type: 'string',
        required: true
      }, {
        arg: 'roleId',
        type: 'string',
        required: true
      }
    ],
    returns: {
      arg: 'json',
      root: true,
      type: 'User'
    }
  })

  User.afterRemote('create', (ctx, modelInstance, next) => {

    let RoleMapping = User.app.models.RoleMapping
    let Role = User.app.models.Role
    if (ctx.result && ctx.result.role) {
      Role.findOne({
        where: {
          id: ctx.result.role
        }
      }, (err, role) => {
        role
          .principals
          .create({
            principalType: RoleMapping.USER,
            principalId: ctx.result.id
          }, (err, principal) => {
            if (err) 
              throw err;
            }
          )
      })
    }
    next()
  })

  User.getListUsers = (cb) => {

    let RoleMapping = User.app.models.RoleMapping
    let Role = User.app.models.Role
    User.find({
      include: 'role'
    }, (err, userList) => {
      cb(err, userList)
    })
  }

  User.remoteMethod('getListUsers', {
    http: {
      verb: 'get'
    },
    returns: {
      arg: 'data',
      type: 'user',
      root: true
    }
  })
}