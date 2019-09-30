/* eslint-disable linebreak-style */
const users = ` CREATE TABLE IF NOT EXISTS users (
    userid SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(255) DEFAULT 'unverified',
    isadmin BOOLEAN DEFAULT false 
  );`;

const loans = ` CREATE TABLE IF NOT EXISTS loans(
  loanid SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  createdOn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  loan_status VARCHAR(255) DEFAULT 'pending',
  repaid BOOLEAN DEFAULT false,
  tenor INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  paymentinstallment FLOAT NOT NULL,
  balance FLOAT NOT NULL,
  interest FLOAT NOT NULL,
  FOREIGN KEY (email) REFERENCES users(email) ON DELETE CASCADE
);`;

const repayments = ` CREATE TABLE IF NOT EXISTS repayments(
  repaymentid SERIAL PRIMARY KEY,
  createdOn TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  loanid INTEGER NOT NULL,
  amount FLOAT NOT NULL,
  FOREIGN KEY (loanid) REFERENCES loans(loanid) ON DELETE CASCADE
);`;

const createTables = `
  ${users}${loans}${repayments}
`;

export default createTables;
