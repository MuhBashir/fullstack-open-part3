require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const Person = require('./models/person');

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to Mongo db....');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message);
  });

app.use(cors());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.static('dist'));
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  const person = new Person({
    name: name,
    number: number,
  });

  // const personExisted = persons.find(
  //   (person) => person.name === personObj.name
  // );

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing!' });
  }

  // if (personExisted) {
  //   return res.status(400).json({ message: 'name must be unique' });
  // }

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

// let persons = [
//   {
//     id: 1,
//     name: 'Arto Hellas',
//     number: '040-123456',
//   },
//   {
//     id: 2,
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//   },
//   {
//     id: 3,
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//   },
//   {
//     id: 4,
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//   },
// ];

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// info routes

app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    res.send(`
  
  <p>Phonebook has info for ${persons.length}
  <br />
  ${new Date()}
  
  </p>
  
  `);
  });
});

// routes for displaying single person

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (person) {
        return res.json(person);
      } else {
        return res.status(404).json({ error: 'person not found' });
      }
    })
    .catch((error) => next(error));
});

// routes for updating a single resource

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// routes for deleting a single resource

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;

  Person.findByIdAndDelete(id)
    .then((result) => {
      console.log(result);
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// adding a person routes

app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
