const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Motorcycle = new Schema({
  //Condição  
  condition: { type: String, Required: '' },
  //Descrição da condição
  condition_desc: { type: String, Required: '' },
  //Preço
  price: { type: String, Required: '' },
  //Localização
  location: { type: String, Required: '' },
  //Ano modelo
  model_year: { type: String, Required: '' },
  //Cor Exterior
  exterior_color: { type: String, Required: '' },
  //Marca / Marca
  make: { type: String, Required: '' },
  //O veículo tem garantia?
  warranty: { type: String, Required: '' },
  //Maquete de bicicleta
  model: { type: String, Required: '' },
  //Campo opcional do submodelo.
  sub_model: { type: String, Required: '' },
  //Tipo de motocicleta
  type: { type: String, Required: '' },  
})

module.exports = mongoose.model('Motorcycle', Motorcycle);