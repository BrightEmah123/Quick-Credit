/* eslint-disable linebreak-style */
/* eslint-disable camelcase */
import '@babel/polyfill';
import loans from '../database/models/loans';

class repaymentController {
  /**
     * @description Create Loan Repayment Record
     * @param {*} req
     * @param {*} res
     * @returns {object} JSON response
     */
  static async createRepayment(req, res) {
    const adminStatus = req.user;
    const { loanid } = req.params;
    const { paidAmount } = req.body;
    const id = Number(loanid);
    const amount = Number(paidAmount);
    try {
      if (adminStatus) {
        const findAllLoans = await loans.findByLoanID(id);
        const allData = findAllLoans.rows[0];
        if (!allData) {
          res.status(404).json({
            status: 404,
            error: 'Loan Entry not found',
          });
          return;
        }
        const { tenor } = allData;
        await loans.updateLoan(amount, tenor, id);
        const updatedLoans = await loans.findByLoanID(id);
        const updatedData = updatedLoans.rows[0];
        await loans.saveUpdatedLoan(id, amount);
        const getRepayments = await loans.retrieveRepayments(id);
        const repaymentData = getRepayments.rows[0];
        // // Display
        const { paymentinstallment, balance } = updatedData;
        const { repaymentid, createdon } = repaymentData;
        const data = {
          id: repaymentid,
          loanid: id,
          createdon,
          amount,
          monthlyInstallment: paymentinstallment,
          balance,
        };
        res.status(201).json({
          status: 201,
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
   * @description Get Repayment Records
   * @param {*} req
   * @param {*} res
   * @returns {object} JSON response
   */
  static async getRepaymentRecord(req, res) {
    const status = req.user;
    const { loanid } = req.params;
    const { email } = status;
    const id = Number(loanid);
    try {
      if (status) {
        const getUserLoans = await loans.findLoanByEmail(email);
        const userData = getUserLoans.rows[0];
        const getRepayments = await loans.retrieveRepayments(id);
        const data = getRepayments.rows[0];
        if (!data) {
          res.status(404).json({
            status: 404,
            error: 'Repayment Entry not found',
          });
          return;
        }
        if (userData.loanid !== data.loanid) {
          res.status(403).json({
            status: 403,
            error: 'User did not create this loan',
          });
          return;
        }
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
}

export default repaymentController;
