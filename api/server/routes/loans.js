/* eslint-disable linebreak-style */
import { Router } from 'express';
import Validation from '../middlewares/loanValidation';
import loanController from '../controllers/loans';
import repaymentController from '../controllers/repayments';
import Authorization from '../middlewares/Authorization';

const loanRoute = Router();

loanRoute.post('/', Authorization.verifyUser, Validation.createLoanValidation, loanController.createLoan);
loanRoute.get('/:loanid', Authorization.verifyAdmin, Validation.getALoanValidation, loanController.specificLoan);
loanRoute.get('/', Authorization.verifyAdmin, loanController.retrieveLoans);
loanRoute.patch('/:loanid/approve', Authorization.verifyAdmin, loanController.loanApprove);
loanRoute.patch('/:loanid/reject', Authorization.verifyAdmin, loanController.loanReject);
loanRoute.post('/:loanid/repayment', Authorization.verifyAdmin, Validation.repaymentValidation, repaymentController.createRepayment);
loanRoute.get('/:loanid/repayments', Authorization.verifyUser, repaymentController.getRepaymentRecord);

export default loanRoute;
