const fs = require('fs');
const data = require('./data.json');
const { age, date } = require('./utils');

exports.show = function(request, response) {

  const { id } = request.params

  const foundDog = data.dogs.find( function(dog) {
    return id == dog.id 
  })

  if (!foundDog) return response.send("Pet não encontrado");


  const dog = {
    ...foundDog,
    // vaccine:  new Intl.DateTimeFormat("pt-BR").format(foundDog.vaccine),
    age: age(foundDog.birth),
    abiliity: foundDog.abiliity.split(",")

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

  birth = Date.parse(birth);  
  const id = Number(data.dogs.length + 1)

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
    birth: date(foundDog.birth)
  }

  return response.render('dogs/edit', { dog });
}

exports.put = function(request, response) {
  const { id } = request.body;
  const foundDog = data.dogs.find( function(dog) {
    return id == dog.id
  });

  if(!foundDog) return response.send('Pet não encontrado');

  const dog = {
    ...foundDog,
    ...request.body,
    birth: Date.parse(request.body)
  }

  data.dogs[id - 1] = dog;

  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) return response.send('erro na ecrita do arquivo')
  });

  return response.redirect(`/dogs/${id}`);

}
