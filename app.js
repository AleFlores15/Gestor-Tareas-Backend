const express = require('express'); 
const app = express(); 
const usuarioRoutes = require('./routes/usuario.routes'); 
const tareaRoutes = require('./routes/tarea.routes'); 

app.use(express.json()); 
app.use('/api/auth', usuarioRoutes); 
app.use('/api/tasks', tareaRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports = app;
