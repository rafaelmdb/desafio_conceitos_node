const express = require("express");
const cors = require("cors");
const { v4: uuid, isUuid } = require('uuid');
const {StatusCodes} = require('http-status-codes')

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    const {owner} = request.query;

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const {title, url, techs} = request.body;
    const repository = {id: uuid(), title: title, url: url, techs: techs, likes: 0}
    repositories.push(repository);
    return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const {id} = request.params;
    const {title, url, techs} = request.body;
    const repoIndex = obterRepositorio(id);

    if (repositorioExiste(repoIndex)){
        repositories[repoIndex].title = title;
        repositories[repoIndex].url = url;
        repositories[repoIndex].techs = techs;
        return response.json(repositories[repoIndex]);
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O repositório ${id} não existe`);
    }
});

app.delete("/repositories/:id", (request, response) => {
    const {id}= request.params;
    const repoIndex = obterRepositorio(id);

    if(repositorioExiste(repoIndex)){
        const title = repositories[repoIndex].title;
        repositories.splice(repoIndex);
        return response.status(StatusCodes.NO_CONTENT).json(`Repositório ${title} removido`);
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O repositório ${id} não existe`);
    }
});

app.post("/repositories/:id/like", (request, response) => {
    const {id}= request.params;
    const repoIndex = obterRepositorio(id);

    if (repositorioExiste(repoIndex)){
        repositories[repoIndex].likes+=1;
        return response.json(repositories[repoIndex]);
    }
    else{
        return response.status(StatusCodes.BAD_REQUEST).json(`O repositório ${id} não existe`);
    }
});

function obterRepositorio(id){
    return repositories.findIndex(repo => repo.id===id);
}

function repositorioExiste(id){
    return id>=0;
}

module.exports = app;

/*app.listen(3333, ()=>{
    console.log('Rodando');
});*/