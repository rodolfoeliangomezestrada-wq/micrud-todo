const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error:', err));

const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  completada: { type: Boolean, default: false },
  categoria: { type: String, default: 'General' },
  prioridad: { type: String, enum: ['Alta', 'Media', 'Baja'], default: 'Media' },
  fechaLimite: { type: Date },
  fecha: { type: Date, default: Date.now }
});

const Tarea = mongoose.model('Tarea', TareaSchema);

// CREATE
app.post('/api/tareas', async (req, res) => {
  try {
    const tarea = new Tarea(req.body);
    await tarea.save();
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get('/api/tareas', async (req, res) => {
  try {
    const tareas = await Tarea.find().sort({ fecha: -1 });
    res.json(tareas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put('/api/tareas/:id', async (req, res) => {
  try {
    const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tarea);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE
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