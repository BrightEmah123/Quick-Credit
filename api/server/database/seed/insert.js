/* eslint-disable linebreak-style */
import debug from 'debug';
import bcrypt from 'bcrypt';
import client from '../helpers/connection';

const Debug = debug('dev');

const adminPassword = bcrypt.hashSync('RyE74wmzS3xIf6Rjz4D', 10);
const userPassword = bcrypt.hashSync('AWERNfghb865v5zS3xIf6Rjz4D', 10);

const insert = `
    INSERT INTO users(firstname, lastname, email, password, address, status, isadmin)
    SELECT * FROM (SELECT 'Admin', 'QuickCredit', 'admin@quickcredit.com', '${adminPassword}', 'Dumbo', 'verified', true) AS tmp
    WHERE NOT EXISTS (
        SELECT firstname FROM users WHERE firstname = 'Admin'
    ) LIMIT 1;
    
    INSERT INTO users(firstname, lastname, email, password, address, status, isadmin)
    SELECT * FROM (SELECT 'John', 'Doe', 'jd@generifc.com', '${userPassword}', 'upper east side', 'verified', false) AS tmp
    WHERE NOT EXISTS (
        SELECT firstname FROM users WHERE firstname = 'John' AND lastname = 'Doe'
    ) LIMIT 1;

    INSERT INTO users(firstname, lastname, email, password, address, status, isadmin)
    SELECT * FROM (SELECT 'Jane', 'Doe', 'janed@generic.com', '${userPassword}', 'harlem', 'unverified', false) AS tmp
    WHERE NOT EXISTS (
        SELECT firstname FROM users WHERE firstname = 'Jane' AND lastname = 'Doe'
    ) LIMIT 1;

    INSERT INTO users(firstname, lastname, email, password, address, status, isadmin)
    SELECT * FROM (SELECT 'Joan', 'Arc', 'jarc@generic.com', '${userPassword}', 'hells kitchen', 'unverified', false) AS tmp
    WHERE NOT EXISTS (
        SELECT firstname FROM users WHERE firstname = 'Joan' AND lastname = 'Arc'
    ) LIMIT 1;

    INSERT INTO users(firstname, lastname, email, password, address, status, isadmin)
    SELECT * FROM (SELECT 'John', 'Smith', 'jsmith@generic.com', '${userPassword}', 'TribeCa', 'unverified', false) AS tmp
    WHERE NOT EXISTS (
        SELECT firstname FROM users WHERE firstname = 'John' AND lastname = 'Smith'
    ) LIMIT 1;

    INSERT INTO loans(email, createdon, loan_status, repaid, tenor, amount, paymentinstallment, balance, interest)
    SELECT * FROM (SELECT 'jarc@generic.com', TO_TIMESTAMP(2019-09-09), 'pending', false, 10, 4, 20, 100, 23.2) AS tmp
    WHERE NOT EXISTS (
        SELECT email FROM loans WHERE email = 'jarc@generic.com'
    ) LIMIT 1;

    INSERT INTO loans(email, createdon, loan_status, repaid, tenor, amount, paymentinstallment, balance, interest)
    SELECT * FROM (SELECT 'janed@generic.com', TO_TIMESTAMP(2019-09-09), 'approved', true, 3, 22, 102, 20.2, 23.2) AS tmp
    WHERE NOT EXISTS (
        SELECT email FROM loans WHERE email = 'janed@generic.com'
    ) LIMIT 1;

    INSERT INTO loans(email, createdon, loan_status, repaid, tenor, amount, paymentinstallment, balance, interest)
    SELECT * FROM (SELECT 'jd@generifc.com', TO_TIMESTAMP(2019-09-09), 'approved', false, 12, 122, 18.2, 22.2, 35.1) AS tmp
    WHERE NOT EXISTS (
        SELECT email FROM loans WHERE email = 'jd@generifc.com'
    ) LIMIT 1;

    INSERT INTO loans(email, createdon, loan_status, repaid, tenor, amount, paymentinstallment, balance, interest)
    SELECT * FROM (SELECT 'jsmith@generic.com', TO_TIMESTAMP(2019-09-09), 'pending', false, 10, 622, 12.2, 21.2, 45.1) AS tmp
    WHERE NOT EXISTS (
        SELECT email FROM loans WHERE email = 'jsmith@generic.com'
    ) LIMIT 1;

    `;
client.query(insert, (error) => {
  Debug('Rows Inserted');
  Debug('error: ', error);
  client.end();
});
