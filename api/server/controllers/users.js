/* eslint-disable linebreak-style */
import '@babel/polyfill';
import users from '../database/models/users';

class userController {
  /**
   * @description Verify a User
   * @param {*} req
   * @param {*} res
   * @returns {object} JSON response
   */
  static async verifyAUser(req, res) {
    const adminStatus = req.user;
    const { email } = req.params;
    const status = 'verified';
    try {
      const findUsers = await users.findOneEmail(email);
      const getAllUsers = findUsers.rows[0];
      if (!getAllUsers) {
        res.status(404).json({
          status: 404,
          error: 'User does not exist',
        });
        return;
      }
      const checkValidity = await users.findVerifiedUsers(status, email);
      const data = checkValidity.rows;
      if (data[0]) {
        res.status(401).json({
          status: 401,
          error: 'This User has been verified already',
        });
        return;
      }
      if (adminStatus) {
        await users.verifyUser(status, email);
        res.status(200).json({
          status: 200,
          message: 'User verified successfully',
        });
        return;
      }
      res.status(401).json({
        status: 401,
        error: 'Unauthorized to verify a user',
      });
      return;
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message,
      });
    }
  }
}
export default userController;
