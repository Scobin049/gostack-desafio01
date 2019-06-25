const express = require("express");
const server = express();

server.use(express.json());

let projects = [
  { id: "1", title: "Novo projeto", tasks: [] },
  { id: "2", title: "Novo projeto 2", tasks: [] }
];
let cont = 0;

server.use((req, res, next) => {
  cont++;
  console.log(`Requisiçaõ nº: ${cont}`);
  return next();
});

//Middlewares
function identifyIndex(req, res, next) {
  const { id } = req.params;
  let index = -1;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      index = i;
    }
  }

  if (index == -1) {
    return res.status(400).json({ erro: "ID não localizado" });
  }
  req.index = index;

  return next();
}

function verifyIdExists(req, res, next) {
  const { id } = req.body;

  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id == id) {
      return res.status(400).json({ erro: "ID já cadastrado" });
    }
  }

  return next();
}

//Projects
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", identifyIndex, (req, res) => {
  const { index } = req;
  return res.json(projects[index]);
});

server.post("/projects", verifyIdExists, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, tasks: [] });

  return res.json(projects);
});

server.put("/projects/:id", identifyIndex, (req, res) => {
  const { title } = req.body;
  const { index } = req;

  projects[index].title = title;

  return res.json(projects);
});

server.delete("/projects/:id", identifyIndex, (req, res) => {
  const { index } = req;
  projects.splice(index, 1);
  return res.send();
});

//Tasks
server.post("/projects/:id/tasks", identifyIndex, (req, res) => {
  const { index } = req;
  const { title } = req.body;

  projects[index].tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
