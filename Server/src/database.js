const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Sebastianmn03?',
    database: 'HuellitasTunja',
    port: '5433'
})

pool.connect((err, user, release) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err.stack);
    } else {
      console.log('Conectado a la base de datos exitosamente');
      release();
    }
  });

module.exports = {
    pool
}

