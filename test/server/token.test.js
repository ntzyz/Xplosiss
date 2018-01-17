'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../index'));
let token = require('../../utils').token;

describe('Testing token-related APIs.', () => {
  it('Emit forgot event', async () => {
    const url = '/api/token/forgot';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Check wrong token', async () => {
    const url = `/api/token/check?token=${233}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.result).to.be.false;
  });

  it('Check right token', async () => {
    const url = `/api/token/check?token=${token}`;
    const response = await agent.get(url).expect(200);
    
    expect(response.body.status).to.be.ok;
    expect(response.body.result).to.be.true;
  });
});