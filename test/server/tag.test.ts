'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';
import { BlogTag } from '../../types/models';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing tag-related APIs.', () => {
  let tags: BlogTag[];

  it('Fetch tag list', async () => {
    const url = '/api/tag';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.tags).not.to.be.undefined;

    tags = response.body.tags;
  });

  it('Fetch posts under category', async () => {
    const url = `/api/tag/${tags[0].tag}/posts`;
    const response = await agent.get(url).expect(200);
    expect(response.body.status).to.be.ok;
    expect(response.body.posts).not.to.be.undefined;
  });
});