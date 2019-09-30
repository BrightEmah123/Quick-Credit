/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import client from '../helpers/connection';

export default {
  requestLoan: ({
    email,
    amount,
    tenor,
  }) => client.query({
    text: 'INSERT INTO loans(email, amount, tenor, interest, paymentinstallment, balance) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    values: [email, amount, tenor, (0.05 * parseFloat(amount).toFixed(2)), (amount + (0.05 * parseFloat(amount).toFixed(2))), (parseFloat((amount + (0.05 * parseFloat(amount).toFixed(2))) * tenor).toFixed(2))],
  }),
  findLoans: () => client.query({
    text: 'SELECT * FROM loans',
    values: [],
  }),
  approveLoan: loanid => client.query({
    text: "UPDATE loans SET loan_status = 'approved' WHERE loanid = $1;",
    values: [loanid],
  }),
  rejectLoan: loanid => client.query({
    text: "UPDATE loans SET loan_status = 'rejected' WHERE loanid = $1;",
    values: [loanid],
  }),
  findLoanByEmail: email => client.query({
    text: 'SELECT * FROM loans WHERE email = $1 LIMIT 1',
    values: [email],
  }),
  findByLoanID: loanid => client.query({
    text: 'SELECT * FROM loans WHERE loanid = $1 LIMIT 1',
    values: [loanid],
  }),
  findAllCurrentRepaid: (loan_status, repaid) => client.query({
    text: 'SELECT * From loans WHERE loan_status = $1 AND repaid = $2',
    values: [loan_status, repaid],
  }),
  updateLoan: (amount, tenor, loanid) => client.query({
    text: 'UPDATE loans SET repaid = true, amount = $1, interest = $2, paymentinstallment = $3, balance = $4 WHERE loanid = $5',
    values: [amount, (0.05 * parseFloat(amount).toFixed(2)), (amount + (0.05 * parseFloat(amount).toFixed(2))), (parseFloat((amount + (0.05 * parseFloat(amount).toFixed(2))) * tenor).toFixed(2)), loanid],
  }),
  saveUpdatedLoan: (loanid, amount) => client.query({
    text: 'INSERT INTO repayments(loanid, amount) VALUES ($1, $2) RETURNING *',
    values: [loanid, amount],
  }),
  retrieveRepayments: loanid => client.query({
    text: 'SELECT * FROM repayments WHERE loanid = $1',
    values: [loanid],
  }),
};
