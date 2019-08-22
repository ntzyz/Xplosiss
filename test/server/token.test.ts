'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';

const agent = supertest.agent(site);
const token = utils.token;

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