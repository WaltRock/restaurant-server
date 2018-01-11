'use strict'

module.exports = (app) => {
  var User = app.models.user
  var Role = app.models.Role
  var RoleMapping = app.models.RoleMapping
  var EstadoOrden = app.models.EstadoOrden

  EstadoOrden.find((err, lista) => {
    if (!lista || lista.length === 0) {
      let estadoOrden = [{
          descripcion: "Comanda"
        },
        {
          descripcion: "En proceso"
        },
        {
          descripcion: "Terminado"
        },
      ]
      EstadoOrden.create(estadoOrden)
    }
  })

  var getUsuarioAdm = new Promise((resolve, reject) => {
    function crearUsuarioAdm() {
      let user = {
        email: 'walt@tekton.com',
        user: 'walt',
        password: '123123',
        name: 'Walter',
        lastName: 'Quispe Rios',
        dni: '47052204'
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
      if (!user && !err) {
        crearUsuarioAdm()
      } else if (err) {
        reject(err)
      } else {
        resolve(user)
      }
    })
  })

  var getRoleAdm = new Promise((resolve, reject) => {
    function crearRoleAdm() {
      let data = [{
        name: 'Admin',
        description: 'Administrador'
      }, {
        name: 'Cajero',
        description: 'Cajero del restaurant'
      }, {
        name: 'Chef',
        description: 'Chef del restaurant'
      }];
      Role.create(data, (err, role) => {
        if (err) {
          reject(err)
        } else {
          resolve(role[0])
        }
      })
    }
    Role.findOne({
      where: {
        name: 'Admin'
      }
    }, (err, role) => {

      if (!role && !err) {
        crearRoleAdm()
      } else if (err) {
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
          if (!data) {
            role
              .principals
              .create({
                principalType: RoleMapping.USER,
                principalId: user.id
              }, function (err, principal) {
                if (err)
                  throw err;
              });
          }
        })
    })
}