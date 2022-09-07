import {
  createServer,
  Factory,
  Model,
  Response,
  ActiveModelSerializer,
  RestSerializer,
} from 'miragejs'
import faker from '@faker-js/faker'

type User = {
  name: string
  email: string
  created_at: string
}

export function makeServer() {
  const server = createServer({
    serializers: {
      application: ActiveModelSerializer,
    },

    models: {
      user: Model.extend<Partial<User>>({}),
      //   <Partial<User>> means that some columns of User can be ommitted when creating a user
    },

    factories: {
      user: Factory.extend({
        name(i: number) {
          return `User ${i + 1}`
        },
        email() {
          return faker.internet.email().toLocaleLowerCase()
        },
        createdAt() {
          return faker.date.recent(10)
        },
      }),
      //   factory to create users
    },

    seeds(server) {
      server.createList('user', 20)
    },

    routes() {
      this.namespace = 'api'
      this.timing = 750
      // 750ms setTimeout for an HTTP request

      this.get('/users', function (schema, request) {
        const { page = 1, per_page = 10 } = request.queryParams

        const userObject = schema.all('user')

        const total = userObject.length

        const pageStart = (Number(page) - 1) * Number(per_page)
        const pageEnd = pageStart + Number(per_page)

        const users = this.serialize(userObject).users.slice(pageStart, pageEnd)

        return new Response(200, { 'x-total-count': String(total) }, { users })
      })
      this.get('/users/:id')
      this.post('/users')
      this.put('/users/:id', function (schema, request) {
        const { user } = JSON.parse(request.requestBody)

        const userObject = schema.findBy('user', { email: user.email })
        // or userObject = schema.find('user', request.params.id)

        userObject.name = user.name
        userObject.email = user.email
        userObject.save()

        const updated_user = {
          name: userObject.attrs.name,
          email: userObject.attrs.name,
          id: userObject.id,
        }

        return new Response(200, {}, { updated_user })
      })
      this.namespace = ''
      //   reset to '', in order to not generate conflict with the /api by Next.js
      this.passthrough()
    },
  })

  return server
}
