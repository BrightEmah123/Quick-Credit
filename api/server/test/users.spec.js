/* eslint-disable linebreak-style */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import dataFeed from './test-model/dataFeed.spec';

chai.use(chaiHttp);

const { expect } = chai;
const usersURI = '/api/v1/users';
const loginURL = '/api/v1/auth';
const userEmail = 'janed@generic.com';
const userNotExist = 'bhfhf@gghgh.com';
const userEmailTwo = 'jd@generifc.com';
let currentToken;

describe('USER VERIFICATION TEST', () => {
  describe('PATCH api/v1/users/:email/verify', () => {
    before((done) => {
      chai.request(app)
        .post(`${loginURL}/signin`)
        .send(dataFeed.adminSignin[0])
        .end((loginErr, loginRes) => {
          currentToken = loginRes.body.data.token;
          done(loginErr);
        });
    });
    it('Should successfully verify a user', (done) => {
      chai.request(app)
        .patch(`${usersURI}/${userEmail}/verify`)
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 404 status code if user email does not exist', (done) => {
      chai.request(app)
        .patch(`${usersURI}/${userNotExist}/verify`)
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 401 status code if the user has been verified already', (done) => {
      chai.request(app)
        .patch(`${usersURI}/${userEmailTwo}/verify`)
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});
