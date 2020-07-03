const express = require('express');
const routes = express.Router();
const dogs = require('./controllers/dogs');
const vets = require('./controllers/vets');

routes.get('/', function(request, response) {
  return response.redirect('/dogs');
});

routes.get('/dogs', dogs.index);
routes.get('/dogs/create', dogs.create);
routes.get('/dogs/:id', dogs.show);
routes.get('/dogs/:id/edit', dogs.edit);
routes.post('/dogs', dogs.post);
routes.put('/dogs', dogs.put);
routes.delete('/dogs', dogs.delete);


//VETERINÁRIOS

routes.get('/vets', vets.index);
routes.get('/vets/create', vets.create);
routes.get('/vets/:id', vets.show);
routes.get('/vets/:id/edit', vets.edit);
routes.post('/vets', vets.post);
routes.put('/vets', vets.put);
routes.delete('/vets', vets.delete);

module.exports = routes;

