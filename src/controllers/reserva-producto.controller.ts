import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Reserva,
  Producto,
} from '../models';
import {ReservaRepository} from '../repositories';

export class ReservaProductoController {
  constructor(
    @repository(ReservaRepository) protected reservaRepository: ReservaRepository,
  ) { }

  @get('/reservas/{id}/productos', {
    responses: {
      '200': {
        description: 'Array of Reserva has many Producto',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Producto)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Producto>,
  ): Promise<Producto[]> {
    return this.reservaRepository.productos(id).find(filter);
  }

  @post('/reservas/{id}/productos', {
    responses: {
      '200': {
        description: 'Reserva model instance',
        content: {'application/json': {schema: getModelSchemaRef(Producto)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Reserva.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {
            title: 'NewProductoInReserva',
            exclude: ['id'],
            optional: ['reservaId']
          }),
        },
      },
    }) producto: Omit<Producto, 'id'>,
  ): Promise<Producto> {
    return this.reservaRepository.productos(id).create(producto);
  }

  @patch('/reservas/{id}/productos', {
    responses: {
      '200': {
        description: 'Reserva.Producto PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {partial: true}),
        },
      },
    })
    producto: Partial<Producto>,
    @param.query.object('where', getWhereSchemaFor(Producto)) where?: Where<Producto>,
  ): Promise<Count> {
    return this.reservaRepository.productos(id).patch(producto, where);
  }

  @del('/reservas/{id}/productos', {
    responses: {
      '200': {
        description: 'Reserva.Producto DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Producto)) where?: Where<Producto>,
  ): Promise<Count> {
    return this.reservaRepository.productos(id).delete(where);
  }
}
