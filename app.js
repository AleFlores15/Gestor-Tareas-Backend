const express = require('express'); 
const app = express(); 
const usuarioRoutes = require('./routes/usuario.routes'); 
const tareaRoutes = require('./routes/tarea.routes'); 
const cors = require('cors');

app.use(express.json()); 
app.use('/api/auth', usuarioRoutes); 
app.use('/api/tasks', tareaRoutes); 


const corsOptions = {
  origin: process.env.FRONTEND_URL || "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports = app;
