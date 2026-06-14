const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error:', err));

// Modelo de Tarea
const Tarea = mongoose.model('Tarea', {
  titulo: String,
  completada: { type: Boolean, default: false },
  fecha: { type: Date, default: Date.now }
});

// RUTAS CRUD

// CREATE - Crear tarea
app.post('/api/tareas', async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ - Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ fecha: -1 });
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - Actualizar tarea
app.put('/api/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Eliminar tarea
app.delete('/api/tareas/:id', async (req, res) => {
  try {
    await Tarea.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));