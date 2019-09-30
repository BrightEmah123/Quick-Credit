/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import '@babel/polyfill';
import loans from '../database/models/loans';
import users from '../database/models/users';

class loanController {
  /**
     * @description Create Loan Application
     * @param {*} req
     * @param {*} res
     * @returns {object} JSON response
     */
  static async createLoan(req, res) {
    const status = req.user;
    const { email } = status;
    const {
      amount,
      tenor,
    } = req.body;

    try {
      if (status) {
        const findUser = await users.findOneEmail(email);
        const userData = findUser.rows[0];
        if (userData.status === 'unverified') {
          res.status(401).json({
            status: 401,
            error: 'User must be verified before applying for a loan',
          });
          return;
        }
        const loanData = await loans.requestLoan({ ...req.body, email });
        const data = loanData.rows[0];
        res.status(201).json({
          status: 201,
          data: {
            ...data,
          },
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
    * @description Get a Specific Loan Application
    * @param {*} req
    * @param {*} res
    * @returns {object} JSON response
    */
  static async specificLoan(req, res) {
    const status = req.user;
    const { loanid } = req.params;
    try {
      const findALoan = await loans.findByLoanID(loanid);
      const data = findALoan.rows[0];
      if (!data) {
        res.status(401).json({
          status: 401,
          error: 'Loan Id not found',
        });
        return;
      }
      if (status) {
        res.status(200).json({
          status: 200,
          data,
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
    * @description Get all Loan Applications
    * @param {*} req
    * @param {*} res
    * @returns {object} JSON response
    */
  static async retrieveLoans(req, res) {
    const status = req.user;
    const { loan_status, repaid } = req.query;
    try {
      if (status) {
        if (loan_status && repaid) {
          const getCurrentLoans = await loans.findAllCurrentRepaid(loan_status, repaid);
          const data = getCurrentLoans.rows;
          if (!data[0]) {
            res.status(409).json({
              status: 409,
              error: 'Invalid Query',
            });
            return;
          }
          res.status(200).json({
            status: 200,
            data,
          });
          return;
        }
        if (!loan_status && repaid) {
          res.status(409).json({
            status: 409,
            error: 'Loan Status or Repaid field required',
          });
          return;
        }
        const allLoans = await loans.findLoans();
        const allData = allLoans.rows;
        if (allData) {
          res.status(200).json({
            status: 200,
            data: allData,
          });
          return;
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
    * @description Approve Loan Application
    * @param {*} req
    * @param {*} res
    * @returns {object} JSON response
    */
  static async loanApprove(req, res) {
    const status = req.user;
    const { loanid } = req.params;
    const id = Number(loanid);
    try {
      const findLoan = await loans.findByLoanID(id);
      const getALLLoans = findLoan.rows[0];
      if (!getALLLoans) {
        res.status(404).json({
          status: 404,
          error: 'Loan does not exist',
        });
        return;
      }
      const checkLoanStatus = await loans.findByLoanID(id);
      const data = checkLoanStatus.rows[0];
      if (data.loan_status === 'approved' || data.loan_status === 'rejected') {
        res.status(401).json({
          status: 401,
          error: 'This Loan is no longer pending',
        });
        return;
      }
      if (status) {
        await loans.approveLoan(id);
        res.status(200).json({
          status: 200,
          message: 'Loan approved successfully',
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
    * @description Reject Loan Application
    * @param {*} req
    * @param {*} res
    * @returns {object} JSON response
    */
  static async loanReject(req, res) {
    const status = req.user;
    const { loanid } = req.params;
    try {
      const findLoan = await loans.findByLoanID(loanid);
      const getALLLoans = findLoan.rows[0];
      if (!getALLLoans) {
        res.status(404).json({
          status: 404,
          error: 'Loan does not exist',
        });
        return;
      }
      const checkLoanStatus = await loans.findByLoanID(loanid);
      const data = checkLoanStatus.rows[0];
      if (data.loan_status === 'approved' || data.loan_status === 'rejected') {
        res.status(401).json({
          status: 401,
          error: 'This Loan is no longer pending',
        });
        return;
      }
      if (status) {
        await loans.rejectLoan(loanid);
        res.status(200).json({
          status: 200,
          message: 'Loan rejected successfully',
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
}

export default loanController;
