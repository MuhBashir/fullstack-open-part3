const mongoose = require('mongoose');

if (process.env.length < 4) {
  console.log(`give password`);
  process.exit(1);
}

// HYnbZgRrM14n9Y37;

const password = process.argv[2];

const mongo_uri = `mongodb+srv://mbashiribrahim7:${password}@cluster0.gmwoxed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(mongo_uri);

mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log('phonebook:');
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
