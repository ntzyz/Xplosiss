'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';
const fakeId = '59423e06ed4418798379a5e7';

import site from '../../index';
import utils from '../../utils';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing media-related APIs.', () => {
  let uploaded = null;

  it('Fetch media lists without token', async () => {
    const url = '/api/media/';
    const response = await agent.get(url).expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Fetch media lists with valid token', async () => {
    const url = `/api/media/?token=${token}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
  });


  it('Upload file without token', async () => {
    const url = '/api/media/cpuinfo';
    const response = await agent.put(url)
      .attach('file', new Buffer('hello world'), 'sample.txt')
      .expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Upload file with valid token', async () => {
    const url = `/api/media/cpuinfo.txt?token=${token}`;
    const response = await agent.put(url)
      .attach('file', new Buffer('hello world'), 'sample.txt')
      .expect(200);

    expect(response.body.status).to.be.ok;

    uploaded = response.body.filename;
  });

  it('Delete file without token', async () => {
    const url = `/api/media/${uploaded}`;
    const response = await agent.delete(url)
      .expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Delete file with valid token', async () => {
    const url = `/api/media/${uploaded}?token=${token}`;
    const response = await agent.delete(url).expect(200);

    expect(response.body.status).to.be.ok;
  });

});
