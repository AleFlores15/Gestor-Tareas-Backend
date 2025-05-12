const express = require('express'); 
const cors = require('cors');
const usuarioRoutes = require('./routes/usuario.routes'); 
const tareaRoutes = require('./routes/tarea.routes'); 

const app = express();

const corsOptions = {
  origin:  "*", //"http://localhost:3000", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json()); 

app.use('/api/auth', usuarioRoutes); 
app.use('/api/tasks', tareaRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports = app;
