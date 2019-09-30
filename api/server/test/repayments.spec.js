/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import dataFeed from './test-model/dataFeed.spec';

chai.use(chaiHttp);

const { expect } = chai;
const repaymentsURI = '/api/v1/loans';
const loginURL = '/api/v1/auth';
let currentToken;
let userToken;

describe('Create a Loan Repayment Record', () => {
  describe('POST api/v1/loans/:loanid/repayment', () => {
    before((done) => {
      chai.request(app)
        .post(`${loginURL}/signin`)
        .send(dataFeed.adminSignin[0])
        .end((loginErr, loginRes) => {
          currentToken = loginRes.body.data.token;
          done(loginErr);
        });
    });
    it('Should successfully create a loan repayment record', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/1/repayment`)
        .send(dataFeed.repayments[0])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('loanid');
          expect(res.body.data).to.have.property('createdon');
          expect(res.body.data).to.have.property('amount');
          expect(res.body.data).to.have.property('monthlyInstallment');
          expect(res.body.data).to.have.property('balance');
          done(err);
        });
    });
    it('Should successfully create a 2nd loan repayment record', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/2/repayment`)
        .send(dataFeed.repayments[0])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('loanid');
          expect(res.body.data).to.have.property('createdon');
          expect(res.body.data).to.have.property('amount');
          expect(res.body.data).to.have.property('monthlyInstallment');
          expect(res.body.data).to.have.property('balance');
          done(err);
        });
    });
    it('Should return a 404 status error if loan Id entry was not found', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/10399466/repayment`)
        .send(dataFeed.repayments[0])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 400 status error if loan Id entered was not a number', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/aaa/repayment`)
        .send(dataFeed.repayments[0])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 400 status error if paid Amount entered was not a number', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/1/repayment`)
        .send(dataFeed.repayments[1])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 400 status error if paid Amount was not entered', (done) => {
      chai.request(app)
        .post(`${repaymentsURI}/1/repayment`)
        .send(dataFeed.repayments[2])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('status');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });

  describe('Retrieve a Loan Repayment Record', () => {
    describe('GET api/v1/loans/:loanid/repayments', () => {
      before((done) => {
        chai.request(app)
          .post(`${loginURL}/signin`)
          .send(dataFeed.User[12])
          .end((loginErr, loginRes) => {
            userToken = loginRes.body.data.token;
            done(loginErr);
          });
      });
      it('Should Successfully retrieve the user repayment record', (done) => {
        chai.request(app)
          .get(`${repaymentsURI}/1/repayments`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('status');
            done(err);
          });
      });
      it('Should return a 404 status if repayment entry is not found', (done) => {
        chai.request(app)
          .get(`${repaymentsURI}/44/repayments`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
      it('Should return a 403 status if the user did not create the loan', (done) => {
        chai.request(app)
          .get(`${repaymentsURI}/2/repayments`)
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.be.a('object');
            expect(res.body).to.have.property('status');
            expect(res.body).to.have.property('error');
            done(err);
          });
      });
    });
  });
});
