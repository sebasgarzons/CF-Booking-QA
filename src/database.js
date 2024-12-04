const mongoose = require('mongoose')
  
const { AGENCIA_MONGODB_HOST, AGENCIA_MONGODB_DATABASE } = process.env;
const MONGODB_URI = `mongodb://${AGENCIA_MONGODB_HOST}/${AGENCIA_MONGODB_DATABASE}`;

mongoose.connect(MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('Conectado a MongoDB'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));