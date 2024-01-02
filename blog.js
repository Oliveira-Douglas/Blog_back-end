const express = require("express");
const uuid = require("uuid");

const app = express();
app.use(express.json());

let posts = [];

// Middleware para validar se os campos title e content existem
const validateFields = (req, res, next) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res
      .status(400)
      .json({ error: "Please provide title and content for the post" });
  }
  next();
};

// Rota para obter todos os posts
app.get("/posts", (req, res) => {
  res.json(posts);
});

// Rota para criar um novo post
app.post("/posts", validateFields, (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: uuid.v4(),
    title,
    content,
    date: new Date().toLocaleDateString(),
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

// Rota para editar um post existente por ID
app.put("/posts/:id", validateFields, (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const postToUpdate = posts.find((post) => post.id === id);

  if (!postToUpdate) {
    return res.status(404).json({ error: "Post not found" });
  }

  postToUpdate.title = title;
  postToUpdate.content = content;
  res.json(postToUpdate);
});

// Rota para excluir um post existente por ID
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;
  const postIndex = posts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  posts.splice(postIndex, 1);
  res.sendStatus(204);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
