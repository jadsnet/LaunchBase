const fs = require('fs');
const data = require('../data.json');
const { date_nasc, date, date_v } = require('../utils');

exports.index = function(resquest, response) {
  return response.render('vets/index', { vets: data.vets })
}

exports.show = function(request, response) {

  const { id } = request.params

  const foundVet = data.vets.find( function(vet) {
    return id == vet.id 
  })

  if (!foundVet) return response.send("Pet não encontrado");


  const vet = {
    ...foundVet,
    birth: date(foundVet.birth).birthDay,
    created_at: date_v(foundVet.created_at)
  }

  return response.render('vets/show', { vet });
}

exports.create = function(request, response) {
  return response.render('vets/create');
}

exports.post = function(request, response) {
  const keys = Object.keys(request.body)

  for(key of keys) {
    if(request.body[keys] == ""){
    return response.send("Por favor preencha todos os campos");
    }
  }

  
  birth = Date.parse(request.body.birth);  
  const created_at = Date.now()
  let id = 1
  const lastVet = data.vets[data.vets.length -1]

  if(lastVet) {
    id = lastVet.id + 1
  }

  data.vets.push({
    id,
    ...request.body,
    birth,
    created_at
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo');

    return response.redirect(`/vets/${id}`);
    
  })

}

exports.edit = function(request, response) {
  const { id } = request.params

  const foundVet = data.vets.find( function(vet) {
    return id == vet.id;
  });

  if (!foundVet) return response.send('Pet não encontrado');

  const vet = {
    ...foundVet,
    birth: date_nasc(foundVet.birth)
  }

  return response.render('vets/edit', { vet });
}

exports.put = function(request, response) {
  const { id } = request.body
  let index = 0

  const foundVet = data.vets.find( function(vet, foundIndex) {
    if(id == vet.id) {
      index = foundIndex
      return true
    }
  });

  if(!foundVet) return response.send('Pet não encontrado');

  const vet = {
    ...foundVet,
    ...request.body,
    birth: Date.parse(request.body.birth),
    id: Number(request.body.id)
  }

  data.vets[index] = vet

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo')
  });

  return response.redirect(`/vets/${id}`);

}

exports.delete = function(request, response) {
  const { id } = request.body

  const filteredVets = data.vets.filter(function(vet) {

    return vet.id != id
  })

  data.vets = filteredVets

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo!')

    return response.redirect('/vets')
  })

}