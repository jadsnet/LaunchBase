const express = require('express');
const routes = express.Router();

routes.get('/', function(request, response) {
  return response.redirect('/dogs');
});

routes.get('/dogs', function(request, response) {
  return response.render('dogs/index');
});

routes.get('/dogs/create', function(request, response) {
  return response.render('dogs/create');
});

routes.get('/members', function(request, response) {
  return response.send('members');
});

module.exports = routes;