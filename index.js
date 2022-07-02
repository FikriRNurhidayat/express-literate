const express = require("express") // impor express
const app = express() // initialisasi express

app.use(express.json());

let todos = [];

app.post("/api/v1/todos", (req, res) => {
    const { content } = req.body;
    const todoID = todos.length + 1;
    const timestamp = new Date();

    const todo = {
        id: todoID,
        content,
        isDone: false,
        createdAt: timestamp,
        updatedAt: timestamp,
        doneAt: null,
    }

    todos.push(todo)

    res.status(201).json(todo);
})

app.get("/api/v1/todos", (req, res) => {
  const { filters } = req.query; // Mengambil parameter filter dari user.

  // Jika user mengirimkan parameter filter
  // Maka lakukan filtering.
  if (!!filters) {
    const todoListResults = todos.filter((i) => {
      return i.isDone === filters.isDone;
    })

    res.status(200).json(todoListResults);
    return;
  }

  // Jika user tidak mengirimkan parameter filter
  // Yaudah tampilin semua data todo
  res.status(200).json(todos);
});

app.put("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params; // Mengambil parameter id dari data Todo
  const { content, isDone } = req.body; // Mengambil parameter content dan isDone

  // Mencari data todo dengan id yang diberikan oleh user
  const todoIndex = todos.findIndex((i) => i.id === Number(id));

  // Kalo todo dengan id yang diberikan user ga ketemu
  // Yaudah kasih tau kalo ga ketemu
  if (todoIndex < 0) {
    res.status(404).json({
      error: {
        message: "Todo not found!"
      }
    });

    return;
  }

  const todo = todos[todoIndex];
  const updatedTodo = {...todo, content, isDone}

  // Jika sudah selesai, maka simpan timestamp
  // ke dalam atribut doneAt
  if (isDone) updatedTodo.doneAt = new Date();

  // Memperbarui data todo dari daftar Todo;
  todos[todoIndex] = updatedTodo;

  res.status(200).json(updatedTodo);
});

app.delete("/api/v1/todos/:id", (req, res) => {
  const { id } = req.params; // Mengambil parameter id dari data Todo
  // Mencari data todo dengan id yang diberikan oleh user
  const todoIndex = todos.findIndex((i) => i.id === Number(id));

  // Kalo todo dengan id yang diberikan user ga ketemu
  // Yaudah kasih tau kalo ga ketemu
  if (todoIndex < 0) {
    res.status(404).json({
      error: {
        message: "Todo not found!"
      }
    });

    return;
  }

  todos = todos.filter((i) => i.id !== Number(id));
  res.status(204).end();
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});
