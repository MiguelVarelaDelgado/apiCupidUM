module.exports = ({ env }) => ({
    defaultConnection: 'default',
    connections: {
      default: {
        connector: 'bookshelf',
        settings: {
          client: 'mysql',
          database: env('DB_NAME'),
          host: env('DB_HOST'),
          port: env('DB_PORT'),
          username: env('DB_USER'),
          password: env('DB_PASS'),
        },
        options: {},
      },
    },
  });
   