'use strict'

module.exports = (Orden) => {
  Orden.createOrder = (nombreCliente, costoTotal, listIdPlatos, estadoOrdenId, cb) => {
    let OrdenDetalle = Orden.app.models.OrdenDetalle

    function saveDetailOrder(orden) {
      let listaDetalles = []
      listIdPlatos.forEach(idPlato => {
        listaDetalles.push({PlatoId: idPlato, OrdenId: orden.id})
      })
      OrdenDetalle.create(listaDetalles, (err, ordenDetalles) => {
        orden.OrdenDetalle = ordenDetalles
        cb(err, orden)
      })
    }

    Orden.create({
      NombreCliente: nombreCliente,
      CostoTotal: costoTotal,
      Fecha: new Date(),
      EstadoOrdenId: estadoOrdenId
    }, (err, orden) => {
      if (err) {
        cb(err)
      } else {
        saveDetailOrder(orden)
      }
    })
  }

  Orden.remoteMethod('createOrder', {
    accepts: [
      {
        arg: 'nombreCliente',
        type: 'string',
        required: true
      }, {
        arg: 'costoTotal',
        type: 'number',
        required: true
      }, {
        arg: 'listIdPlatos',
        type: 'array',
        required: true
      }, {
        arg: 'estadoOrdenId',
        type: 'string',
        required: true
      }
    ],
    returns: {
      arg: 'json',
      root: true
    }
  })

  Orden.getOrderDetails = (idOrder, cb) => {
    // let Plato = Orden.app.models.Plato
    Orden.findOne({
      where: {
        id: idOrder
      },
      include: {
        details: 'DetallePlato'
      }

    }, (err, order) => {
      cb(err, order)
    })
  }
  Orden.remoteMethod('getOrderDetails', {
    accepts: {
      arg: 'OrdenId',
      type: 'string',
      required: true
    },
    returns: {
      arg: 'json',
      root: true,
      type: 'array'
    },
    http: {
      verb: 'get'
    }
  })
}
