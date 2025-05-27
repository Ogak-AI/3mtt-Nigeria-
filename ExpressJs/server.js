const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const items = require('./data');

app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    item ? res.json(item) : res.status(404).json({ error: "Item not found" });
});

app.post('/items', (req, res) => {
    const { name, description } = req.body;
    if (!name || !description) return res.status(400).json({ error: "Name and description are required" });

    const newItem = { id: items.length + 1, name, description };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.put('/items/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    const { name, description } = req.body;
    if (!name || !description) return res.status(400).json({ error: "Name and description are required" });

    item.name = name;
    item.description = description;
    res.json(item);
});

app.delete('/items/:id', (req, res) => {
    const index = items.findIndex(i => i.id == req.params.id);
    if (index === -1) return res.status(404).json({ error: "Item not found" });

    items.splice(index, 1);
    res.json({ message: "Item deleted" });
});
