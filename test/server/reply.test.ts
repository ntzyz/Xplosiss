'use strict';

import supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing reply-related APIs.', () => {
  it('Fetch latest replies', async () => {
    const url = '/api/reply/latest';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.replies).not.to.be.undefined;
  });
});