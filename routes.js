const express = require('express');
const routes = express.Router();
const dogs = require('./dogs');

routes.get('/', function(request, response) {
  return response.redirect('/dogs');
});

routes.get('/dogs', function(request, response) {
  return response.render('dogs/index');
});


routes.get('/dogs/create', function(request, response) {
  return response.render('dogs/create');
});

routes.get('/dogs/:id', dogs.show);

routes.get('/dogs/:id/edit', dogs.edit);

routes.post('/dogs', dogs.post);

routes.put('/dogs', dogs.put);

routes.delete('/dogs', dogs.delete);


routes.get('/members', function(request, response) {
  return response.send('members');
});

module.exports = routes;