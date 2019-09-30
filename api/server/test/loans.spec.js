/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import dataFeed from './test-model/dataFeed.spec';

chai.use(chaiHttp);

const { expect } = chai;
const loansURI = '/api/v1/loans';
const loginURL = '/api/v1/auth';
let currentToken;
let SecondToken;
let adminToken;

describe('LOAN CREATION TEST', () => {
  describe('POST api/v1/loans', () => {
    before((done) => {
      chai.request(app)
        .post(`${loginURL}/signin`)
        .send(dataFeed.User[10])
        .end((loginErr, loginRes) => {
          currentToken = loginRes.body.data.token;
          done(loginErr);
        });
    });
    it('Should successfully create a loan application and return a 201 status', (done) => {
      chai.request(app)
        .post(`${loansURI}/`)
        .send(dataFeed.Loan[0])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('status');
          expect(res.body.data).to.have.property('loanid');
          expect(res.body.data).to.have.property('email');
          expect(res.body.data).to.have.property('amount');
          expect(res.body.data).to.have.property('paymentinstallment');
          expect(res.body.data).to.have.property('createdon');
          expect(res.body.data).to.have.property('repaid');
          done(err);
        });
    });
    it('Should return a 400 status if amount was not entered', (done) => {
      chai.request(app)
        .post(`${loansURI}`)
        .send(dataFeed.Loan[1])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 400 status if tenor was not entered', (done) => {
      chai.request(app)
        .post(`${loansURI}`)
        .send(dataFeed.Loan[2])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    before((done) => {
      chai.request(app)
        .post(`${loginURL}/signin`)
        .send(dataFeed.User[12])
        .end((loginErr, loginRes) => {
          SecondToken = loginRes.body.data.token;
          done(loginErr);
        });
    });
    it('Should return a 401 status if the user hasnt been verified yet before applying', (done) => {
      chai.request(app)
        .post(`${loansURI}`)
        .send(dataFeed.Loan[0])
        .set('Authorization', `Bearer ${SecondToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 401 status if the tenor entered was not between 1 and 12 months', (done) => {
      chai.request(app)
        .post(`${loansURI}`)
        .send(dataFeed.Loan[3])
        .set('Authorization', `Bearer ${currentToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});

describe('RETRIEVE A LOAN TEST', () => {
  describe('GET api/v1/loans/:loanid', () => {
    before((done) => {
      chai.request(app)
        .post(`${loginURL}/signin`)
        .send(dataFeed.adminSignin[0])
        .end((loginErr, loginRes) => {
          adminToken = loginRes.body.data.token;
          done(loginErr);
        });
    });
    it('Should successfully retrieve a loan application', (done) => {
      chai.request(app)
        .get(`${loansURI}/1`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 400 status if the loanid entered was a special character', (done) => {
      chai.request(app)
        .get(`${loansURI}/[]`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 401 status if the loan was not found', (done) => {
      chai.request(app)
        .get(`${loansURI}/994859503`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
    it('Should return a 400 status if the loan entered was not a number', (done) => {
      chai.request(app)
        .get(`${loansURI}/abcdef`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('error');
          done(err);
        });
    });
  });
});

describe('GET ALL LOANS APPLICATION', () => {
  describe('GET api/v1/loans', () => {
    it('Should successfully get all loan applications', (done) => {
      chai.request(app)
        .get(`${loansURI}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
  });
});

describe('GET ALL LOANS APPLICATION VIA QUERY', () => {
  describe('GET api/v1/loans?loan_status=?&repaid=?', () => {
    it('Should successfully get all loan applications that are current', (done) => {
      chai.request(app)
        .get(`${loansURI}?loan_status=approved&repaid=false`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should successfully get all loan applications that are repaid', (done) => {
      chai.request(app)
        .get(`${loansURI}?loan_status=approved&repaid=true`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 409 status if the query is invalid', (done) => {
      chai.request(app)
        .get(`${loansURI}?loan_status=ghyujb&repaid=false`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 409 status if the query was not entered', (done) => {
      chai.request(app)
        .get(`${loansURI}?loan_status=&repaid=false`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
  });
});

describe('APPROVE A LOANS APPLICATION', () => {
  describe('PATCH api/v1/loans/:loanid/approve', () => {
    it('Should successfully approve a loan application', (done) => {
      chai.request(app)
        .patch(`${loansURI}/1/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 401 status error if the loan application is no longer pending', (done) => {
      chai.request(app)
        .patch(`${loansURI}/1/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 404 status error if the loan does not exist', (done) => {
      chai.request(app)
        .patch(`${loansURI}/102034/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
  });
});

describe('REJECT A LOAN APPLICATION', () => {
  describe('PATCH api/v1/loans/:loanid/reject', () => {
    it('Should successfully reject a loan application', (done) => {
      chai.request(app)
        .patch(`${loansURI}/4/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 401 status error if the loan application is no longer pending', (done) => {
      chai.request(app)
        .patch(`${loansURI}/4/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
    it('Should return a 404 status error if the loan does not exist', (done) => {
      chai.request(app)
        .patch(`${loansURI}/6364747/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('status');
          done(err);
        });
    });
  });
});
