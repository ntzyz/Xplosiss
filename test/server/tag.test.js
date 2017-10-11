'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../index'));

describe('Testing tag-related APIs.', () => {
  let tags;

  it('Fetch tag list', async () => {
    const url = '/api/tag';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    // done();
    // expect(response.body.tags).not.to.be.undefined;

    // tags = response.body.tags;
  });

  // it('Fetch posts under category', async () => {
  //   const url = `/api/tag/${tags[0].tag}/posts`;
  //   const response = await agent.get(url).expect(200);
  //   expect(response.body.status).to.be.ok;
  //   expect(response.body.posts).not.to.be.undefined;
  // });
});