'use strict';

module.exports = (app) => {
  var User = app.models.user
  var Role = app.models.Role
  var RoleMapping = app.models.RoleMapping

  var getUsuarioAdm = new Promise((resolve, reject) => {
    function crearUsuarioAdm() {
      let user = {
        email: 'walt@tekton.com',
        user: 'walt',
        password: '123123',
        name: 'Walter',
        lastName: 'Quispe Rios'
      }

      User.create(user, (err, user) => {
        if (err) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    }

    User.findOne({
      where: {
        email: 'walt@tekton.com'
      }
    }, (err, user) => {
      if (!user) {
        crearUsuarioAdm()
      }
      if (err) {
        reject(err)
      } else {
        resolve(user)
      }
    })
  })

  var getRoleAdm = new Promise((resolve, reject) => {
    function crearRoleAdm() {
      Role.create({
        name: 'admin'
      }, (err, role) => {
        if (err) {
          reject(err)
        } else {
          resolve(role)
        }
      })
    }
    Role.findOne({
      where: {
        name: 'admin'
      }
    }, (err, role) => {
      if (!role) {
        crearRoleAdm()
      }
      if (err) {
        reject(err)
      } else {
        resolve(role)
      }
    })

  })

  Promise
    .all([getUsuarioAdm, getRoleAdm])
    .then(res => {
      let user = res[0]
      let role = res[1]

      role
        .principals
        .findOne({
          where: {
            principalId: user.id
          }
        }, (err, data) => {
          if (data) {
            console.log('Ya existe el Role', data)
          } else {
            role
              .principals
              .create({
                principalType: RoleMapping.USER,
                principalId: user.id
              }, function (err, principal) {
                if (err)
                  throw err;
                console.log('Created Creado:', principal);
              });
          }
        })
    })
}