'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing log-related APIs.', () => {
  it('Fetch logs with valid token', async () => {
    const url = `/api/logs?token=${token}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.logs).not.to.be.undefined;
  });

  it('Fetch logs with invalid token', async () => {
    const url = '/api/logs?token=2336666';
    const response = await agent.get(url).expect(403);

    expect(response.body.status).equal('error');
  });
});