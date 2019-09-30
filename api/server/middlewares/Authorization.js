/* eslint-disable linebreak-style */
import Authentication from './Authentication';

/**
 * @description Authenticates User
 */
class Authorization {
  /**
 * @description Verifies if user is an admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
  static async verifyAdmin(req, res, next) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
        res.status(403).send({
          status: 403,
          error: 'Not Authorized',
        });
        return;
      }
      const decoded = Authentication.verifyToken(token);
      const checkStatus = decoded.isadmin;
      if (!checkStatus) {
        res.status(401).send({
          status: 401,
          error: 'Only Admin can access this route',
        });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === 'jwt expired') {
        res.status(500).send({
          status: 500,
          error: 'Admin Token has expired, kindly signin again',
        });
      }
      res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }

  /**
   * @description Verifies if user is authenticated
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async verifyUser(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      if (!token) {
        res.status(403).send({
          success: false,
          message: 'Not Authorized',
        });
        return;
      }

      const decoded = Authentication.verifyToken(token);
      if (!decoded) {
        res.status(401).send({
          success: false,
          message: 'Invalid token',
        });
        return;
      }
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === 'jwt expired') {
        res.status(500).send({
          status: 500,
          error: 'User Token has expired, kindly signin again',
        });
      }
      res.status(500).send({
        status: 500,
        error: error.message,
      });
    }
  }
}
export default Authorization;
