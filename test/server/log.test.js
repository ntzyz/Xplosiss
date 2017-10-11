'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../index'));
let token = require('../../utils').token;

describe('Testing log-related APIs.', () => {
  it('Fetch logs with valid token', async () => {
    const url = `/api/logs?token=${token}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.logs).not.to.be.undefined;
  });

  it('Fetch logs with invalid token', async () => {
    const url = '/api/logs?token=2336666';
    const response = await agent.get(url).expect(400);

    expect(response.body.status).equal('error');
  });
});