const express = require('express');
const path = require('path');
const db = require('./database/database');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Obtener todos los juegos
app.get('/api/juegos', (req, res) => {
    const rows = db.prepare('SELECT * FROM videojuegos').all();
    res.json(rows);
});

// Guardar nuevo juego
app.post('/api/juegos', (req, res) => {
    const { titulo, plataforma, genero, estado } = req.body;
    const info = db.prepare('INSERT INTO videojuegos (titulo, plataforma, genero, estado) VALUES (?, ?, ?, ?)')
                   .run(titulo, plataforma, genero, estado);
    res.json({ id: info.lastInsertRowid });
});

// Editar juego
app.put('/api/juegos/:id', (req, res) => {
    const { titulo, plataforma, genero, estado } = req.body;
    db.prepare('UPDATE videojuegos SET titulo=?, plataforma=?, genero=?, estado=? WHERE id=?')
      .run(titulo, plataforma, genero, estado, req.params.id);
    res.json({ status: "ok" });
});

// Borrar juego
app.delete('/api/juegos/:id', (req, res) => {
    db.prepare('DELETE FROM videojuegos WHERE id = ?').run(req.params.id);
    res.json({ status: "borrado" });
});

app.listen(3000, () => console.log("🚀 Servidor en http://localhost:3000"));