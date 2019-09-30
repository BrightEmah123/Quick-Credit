/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import client from '../helpers/connection';

export default {
  createEntity: ({
    firstName,
    lastName,
    email,
    password,
    address,
  }) => client.query({
    text: 'INSERT INTO users(firstName, lastName, email, password, address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    values: [firstName, lastName, email, bcrypt.hashSync(password, 10), address],
  }),
  findByEmail: email => client.query({
    text: 'SELECT * FROM users WHERE email = $1',
    values: [email],
  }),
  findOneEmail: email => client.query({
    text: 'SELECT * FROM users WHERE email = $1 LIMIT 1',
    values: [email],
  }),
  findVerifiedUsers: (status, email) => client.query({
    text: 'SELECT * FROM users WHERE status = $1 AND email = $2',
    values: [status, email],
  }),
  verifyUser: (status, email) => client.query({
    text: 'UPDATE users SET status = $1 WHERE email = $2;',
    values: [status, email],
  }),
};
