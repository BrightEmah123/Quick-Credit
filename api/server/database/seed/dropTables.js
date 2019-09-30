/* eslint-disable linebreak-style */
import debug from 'debug';
import client from '../helpers/connection';

const Debug = debug('dev');

const dropUsers = `
    DROP TABLE IF EXISTS users CASCADE;
`;

const dropLoans = `
    DROP TABLE IF EXISTS loans CASCADE;
`;

const dropRepayments = `
    DROP TABLE IF EXISTS repayments CASCADE;
`;

const dropTables = `${dropUsers}${dropLoans}${dropRepayments}`;

client.query(dropTables, (error) => {
  Debug('Tables Dropped');
  Debug('error: ', error);
  client.end();
});
