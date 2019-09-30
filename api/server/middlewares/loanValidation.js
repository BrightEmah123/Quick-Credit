/* eslint-disable linebreak-style */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
class loanValidation {
/**
 * @description validates Loan Application
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  static createLoanValidation(req, res, next) {
    // Amount
    if (!req.body.amount) {
      return res.status(400).send({
        status: 400,
        error: 'Amount is required',
      });
    }

    // Tenor
    if (!req.body.tenor) {
      return res.status(400).send({
        status: 400,
        error: 'Tenor is required',
      });
    }
    if (req.body.tenor <= 0 || req.body.tenor > 12) {
      return res.status(400).send({
        status: 400,
        error: 'Tenor is expected to be between 1 and 12 months',
      });
    }
    next();
  }

  /**
 * @description validates a Loan Retrieval
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  static getALoanValidation(req, res, next) {
    // loanid
    if (/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\-|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\""|\;|\:|\s/.test(req.params.loanid)) {
      return res.status(400).send({
        status: 400,
        error: 'Loan Id should not contain special characters or negative values',
      });
    }
    if (/[A-Za-z]/.test(req.params.loanid)) {
      return res.status(400).send({
        status: 400,
        error: 'Loan Id must be a number',
      });
    }
    next();
  }

  /**
 * @description validates a Loan Repayment Request
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  static repaymentValidation(req, res, next) {
    if (!req.params.loanid) {
      return res.status(400).send({
        status: 400,
        error: 'Loanid is required',
      });
    }
    if (/[A-Za-z]/.test(req.params.loanid)) {
      return res.status(400).send({
        status: 400,
        error: 'Loanid must be a number',
      });
    }
    if (!req.body.paidAmount) {
      return res.status(400).send({
        status: 400,
        error: 'Paid Amount is required',
      });
    }
    if (/[A-Za-z]/.test(req.body.paidAmount)) {
      return res.status(400).send({
        status: 400,
        error: 'Paid Amount must be a number',
      });
    }
    next();
  }
}

export default loanValidation;
