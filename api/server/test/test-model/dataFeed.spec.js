/* eslint-disable linebreak-style */
import faker from 'faker';

const firstName = faker.name.firstName();
const lastName = faker.name.lastName();
const email = faker.internet.email();
const password = faker.internet.password();
const address = faker.address.state();
const amount = faker.random.number();
const paidAmount = faker.random.number();


const User = [
  {
    // Register newUser => 0
    firstName,
    lastName,
    email,
    password,
    address,
  },
  {
    // Omitted firstName => 1
    lastName,
    email,
    password,
    address,
  },
  {
    // Omitted lastName => 2
    firstName,
    email,
    password,
    address,
  },
  {
    // Omitted Email => 3
    firstName,
    lastName,
    password,
    address,
  },
  {
    // Omitted Password => 4
    firstName,
    lastName,
    email,
    address,
  },
  {
    // Not-String firstName => 5
    firstName: 111,
    lastName,
    email,
    password,
    address,
  },
  {
    // Not-String lastName => 6
    firstName,
    lastName: 111,
    email,
    password,
    address,
  },
  {
    // Login User => 7
    email,
    password,
  },
  {
    // Omitted-Mail Login User => 8
    password,
  },
  {
    // Omitted-Password Login User => 9
    email,
  },
  {
    // Seeded User Login => 10
    email: 'jd@generifc.com',
    password: 'AWERNfghb865v5zS3xIf6Rjz4D',
  },
  {
    // Seeded 2nd User Login => 11
    email: 'janed@generic.com',
    password: 'AWERNfghb865v5zS3xIf6Rjz4D',
  },
  {
    // Seeded 3rd User Login => 12
    email: 'jarc@generic.com',
    password: 'AWERNfghb865v5zS3xIf6Rjz4D',
  },
];

const InvalidAccess = [
  {
    // Email already exists
    firstName,
    lastName,
    email: 'jd@generifc.com',
    password,
    address,
  },
  {
    //  Incorrect Credentials
    email: 'jd@generifc.com',
    password,
  },
  {
    // Invalid mail or password
    email: 'jada@generic.com',
    password: 'AWERgdhfjio0Nfghb865v5zS3xIf6Rjz4D',
  },
];

const adminSignin = [
  {
    email: 'admin@quickcredit.com',
    password: 'RyE74wmzS3xIf6Rjz4D',
  },
];

const Loan = [
  {
    amount,
    tenor: 8,
  },
  {
    tenor: 8,
  },
  {
    amount,
  },
  {
    amount,
    tenor: 13,
  },
];

const repayments = [
  {
    paidAmount,
  },
  {
    paidAmount: 'asdf',
  },
  {
  },
];

export default {
  User, InvalidAccess, adminSignin, Loan, repayments,
};
