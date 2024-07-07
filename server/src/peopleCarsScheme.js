import find from 'lodash.find'
import remove from 'lodash.remove'

const people = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates'
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs'
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds'
  }
]

const cars = [
  {
    id: '1',
    year: '2019',
    make: 'Toyota',
    model: 'Corolla',
    price: '40000',
    personId: '1'
  },
  {
    id: '2',
    year: '2018',
    make: 'Lexus',
    model: 'LX 600',
    price: '13000',
    personId: '1'
  },
  {
    id: '3',
    year: '2017',
    make: 'Honda',
    model: 'Civic',
    price: '20000',
    personId: '1'
  },
  {
    id: '4',
    year: '2019',
    make: 'Acura ',
    model: 'MDX',
    price: '60000',
    personId: '2'
  },
  {
    id: '5',
    year: '2018',
    make: 'Ford',
    model: 'Focus',
    price: '35000',
    personId: '2'
  },
  {
    id: '6',
    year: '2017',
    make: 'Honda',
    model: 'Pilot',
    price: '45000',
    personId: '2'
  },
  {
    id: '7',
    year: '2019',
    make: 'Volkswagen',
    model: 'Golf',
    price: '40000',
    personId: '3'
  },
  {
    id: '8',
    year: '2018',
    make: 'Kia',
    model: 'Sorento',
    price: '45000',
    personId: '3'
  },
  {
    id: '9',
    year: '2017',
    make: 'Volvo',
    model: 'XC40',
    price: '55000',
    personId: '3'
  }
]

const typeDefs = `
  type Person {
    id: String!
    firstName: String!
    lastName: String!
    cars: [Car]
  }

  type Car {
    id: String!
    year: String!
    make: String!
    model: String!
    price: String!
    personId: String!
  }

  type Query {
    person(id: String!): Person
    people: [Person]
  }

  type Mutation {
    addPerson(id: String!, firstName: String!, lastName: String!): Person
    updatePerson(id: String!, firstName: String!, lastName: String!): Person
    removePerson(id: String!): Person
    addCar(id: String!, year: String!, make: String!, model: String!, price: String!, personId: String!): Car
    updateCar(id: String!, year: String!, make: String!, model: String!, price: String!, personId: String!): Car
    removeCar(id: String!): Car
  }
`;

const resolvers = {
  Query: {
    person: (root, { id }) => find(people, { id }),
    people: () => people
  },
  Mutation: {
    addPerson: (root, { id, firstName, lastName }) => {
      const newPerson = { id: id, firstName, lastName, cars: [] };
      people.push(newPerson);
      return newPerson;
    },
    updatePerson: (root, { id, firstName, lastName }) => {
      const person = find(people, { id });
      if (!person) throw new Error(`Person with id ${id} not found.`);
      person.firstName = firstName;
      person.lastName = lastName;
      return person;
    },
    removePerson: (root, { id }) => {
      const personIndex = people.findIndex(p => p.id === id);
      if (personIndex === -1) throw new Error(`Person with id ${id} not found.`);
      
      remove(cars, { personId: id });
      const [removedPerson] = people.splice(personIndex, 1);
      
      return removedPerson;
    },
    addCar: (root, { id, year, make, model, price, personId }) => {
      const newCar = { id: id, year, make, model, price, personId };
      cars.push(newCar);
      return newCar;
    },
    updateCar: (root, { id, year, make, model, price, personId }) => {
      const carIndex = cars.findIndex(car => car.id === id && car.personId === personId);
      if (carIndex === -1) {
        throw new Error(`Car with id ${id} and personId ${personId} not found.`);
      }
    
      cars[carIndex] = { id, year, make, model, price, personId };
    
      return cars[carIndex];
    },
    removeCar: (root, { id }) => {
      const carIndex = cars.findIndex(c => c.id === id);
      if (carIndex === -1) throw new Error(`Car with id ${id} not found.`);
      const [removedCar] = cars.splice(carIndex, 1);
      return removedCar;
    }
  },
  Person: {
    cars: (person) => cars.filter(car => car.personId === person.id)
  }
};

export { typeDefs, resolvers }
