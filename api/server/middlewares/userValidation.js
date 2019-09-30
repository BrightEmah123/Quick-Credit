/* eslint-disable linebreak-style */
/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
class userValidation {
/**
   * @description validates cancel trip
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static verifyUserValidation(req, res, next) {
    if (!req.params.email) {
      return res.status(400).send({
        status: 400,
        error: "User's email address is required",
      });
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.params.email) === false) {
      return res.status(400).send({
        status: 400,
        error: "User's email address is incorrect",
      });
    }
    next();
  }
}

export default userValidation;
