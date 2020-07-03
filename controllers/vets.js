const fs = require('fs');
const data = require('../data.json');
const { age, date, date_v } = require('../utils');

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
    age: age(foundVet.birth)
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

  let { avatar_url, name, birth, abiliity, breed, gender, vaccine } = request.body

  vaccine = Number(Date.parse(vaccine));
  birth = Date.parse(birth);  
  const id = Number(data.vets.length + 1);

  data.vets.push({
    id,
    avatar_url,
    name,
    birth,
    breed,
    abiliity,
    gender,
    vaccine
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo');

    return response.redirect('/vets');
    
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
    birth: date(foundVet.birth),
    vaccine: date(foundVet.vaccine)
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