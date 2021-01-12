const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function middlewareValidUuid(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'ID inválido do repositório!'})
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes } = request.body;

  const repository = {
      id: uuid(), 
      title, 
      url, 
      techs, 
      likes: 0 
  }

  repositories.push(repository);

  return response.json(repository);

});

app.put("/repositories/:id", middlewareValidUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositório não encontrado'})
  }

  const repo = repositories[repositoryIndex];

  const repository = {
      id,
      title, 
      url, 
      techs,
      likes: repo.likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", middlewareValidUuid, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repositório não encontrado'})
  }
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", middlewareValidUuid, (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(400).json({ error: 'Repositório não encontrado'})
  }

  repository.likes ++;

  return response.json(repository);

});

module.exports = app;
