const fs = require('fs');
const data = require('./data.json');
const { age, date, date_v } = require('./utils');

exports.index = function(resquest, response) {
  return response.render('dogs/index', { dogs: data.dogs })
}

exports.show = function(request, response) {

  const { id } = request.params

  const foundDog = data.dogs.find( function(dog) {
    return id == dog.id 
  })

  if (!foundDog) return response.send("Pet não encontrado");


  const dog = {
    ...foundDog,
    age: age(foundDog.birth),
    abiliity: foundDog.abiliity.split(","),
    vaccine: date_v(foundDog.vaccine)
  }

  return response.render('dogs/show', { dog });
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
  const id = Number(data.dogs.length + 1);

  data.dogs.push({
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

    return response.redirect('/dogs');
    
  })

}

exports.edit = function(request, response) {
  const { id } = request.params

  const foundDog = data.dogs.find( function(dog) {
    return id == dog.id;
  });

  if (!foundDog) return response.send('Pet não encontrado');

  const dog = {
    ...foundDog,
    birth: date(foundDog.birth),
    vaccine: date(foundDog.vaccine)
  }

  return response.render('dogs/edit', { dog });
}

exports.put = function(request, response) {
  const { id } = request.body
  const foundDog = data.dogs.find( function(dog) {
    return id == dog.id
  });

  if(!foundDog) return response.send('Pet não encontrado');

  const dog = {
    ...foundDog,
    ...request.body,
    birth: Date.parse(request.body.birth)
  }

  data.dogs[id - 1] = dog

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo')
  });

  return response.redirect(`/dogs/${id}`);

}

exports.delete = function(request, response) {
  const { id } = request.body

  const filteredDogs = data.dogs.filter(function(dog) {

    return dog.id != id
  })

  data.dogs = filteredDogs

  fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('Erro na escrita do arquivo!')

    return response.redirect('/dogs')
  })

}