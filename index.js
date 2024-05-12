const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.static('dist'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  return res.status(200).json(persons);
});

// info routes

app.get('/info', (req, res) => {
  res.send(`
  
  <p>Phonebook has info for ${persons.length}
  <br />
  ${new Date()}
  
  </p>

  `);
});

// routes for displaying single person

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id === Number(id));

  if (!person) {
    return res.status(404).json({ message: 'not found' });
  }
  res.status(200).json(person);
});

// routes for deleting a single resource

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;

  persons = persons.filter((person) => person.id !== Number(id));

  res.status(204).json({ message: 'resource delete' });
});

// adding a person routes

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  const id = Math.random() * 100000000000000000000000;
  const personObj = {
    name,
    number,
    id: id,
  };

  const personExisted = persons.find(
    (person) => person.name === personObj.name
  );

  if (!name | !number) {
    return res.status(400).json({ error: 'name or number is missing!' });
  }

  if (personExisted) {
    return res.status(400).json({ message: 'name must be unique' });
  }

  res.status(201).json(personObj);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
