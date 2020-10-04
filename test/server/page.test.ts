'use strict';

import supertest from 'supertest';
import { expect } from 'chai';
const fakeId = '59423e06ed4418798379a5e7';

import site from '../../index';
import utils from '../../utils';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing page-related APIs.', () => {
  const pageTemplate = {
    title: 'Hello World',
    slug: `hello-world-${new Date().getTime()}`,
    content: {
      encoding: 'html',
      content: 'Hello World'
    }
  };
  const replyTemplate = {
    user: 'foo',
    email: 'bar@foo.baz',
    site: 'localhost.localdomain',
    content: 'Fork you!',
    datetime: new Date().getTime(),
  };
  let pages: (typeof pageTemplate)[];
  let id: string;

  it('Fetch a page that does not exist', async () => {
    const url = '/api/page/by-slug/this-name-should-not-be-used';
    const response = await agent.get(url).expect(404);

    expect(response.body.status).to.be.equal('error');
  });

  it('Fetch page list', async () => {
    const url = '/api/page';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.pages).not.to.be.undefined;

    pages = response.body.pages;
  });

  it('Create new page without token', async () => {
    const url = '/api/page';
    const response = await agent.put(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Create new page with valid token', async () => {
    const url = `/api/page?token=${token}`;
    const response = await agent.put(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.id).not.to.be.undefined;

    id = response.body.id;
  });

  it('Check if page created', async () => {
    const url = `/api/page/by-slug/${pageTemplate.slug}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.page.title).to.be.equal(pageTemplate.title);
    expect(response.body.page.content).not.to.be.undefined;
    expect(response.body.page.content.encoding).to.be.undefined;
  });

  it('Add reply to one page', async () => {
    const url = `/api/page/by-slug/${pageTemplate.slug}/reply`;
    const response = await agent.put(url)
      .set('Content-Type', 'application/json')
      .send(replyTemplate)
      .expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Check if reply added', async () => {
    const url = `/api/page/by-slug/${pageTemplate.slug}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.page).not.to.be.undefined;
    expect(response.body.page.replies).not.to.be.undefined;
    expect(response.body.page.replies.length).to.be.equal(1);
  });

  it('Update a page without token', async () => {
    pageTemplate.content.content = 'foobar';
    const url = `/api/page/by-id/${id}`;
    const response = await agent.post(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(403);

    expect(response.body.status).equal('error');
  });
  
  it('Update a page with invalid token', async () => {
    pageTemplate.content.content = 'foobar';
    const url = '/api/page/by-id/233666';
    const response = await agent.post(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(403);

    expect(response.body.status).equal('error');
  });
  
  it('Update the new page', async () => {
    pageTemplate.content.content = 'foobar';
    const url = `/api/page/by-id/${id}?token=${token}`;
    const response = await agent.post(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Check if page is updated', async () => {
    const url = `/api/page/by-id/${id}/raw?token=${token}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.page.title).to.be.equal(pageTemplate.title);
    expect(response.body.page.content.content).to.be.equal(pageTemplate.content.content);
  });

  it('Fetch a page that doesnt exist', async () => {
    const url = `/api/page/by-id/${fakeId}/raw?token=${token}`;
    const response = await agent.get(url).expect(404);

    expect(response.body.status).equal('error');
  });

  it('Fetch a page with invalid id', async () => {
    const url = `/api/page/by-id/5423e06ed4418798379a5e7/raw?token=${token}`;
    const response = await agent.get(url).expect(500);

    expect(response.body.status).equal('error');
  });

  it('Delete one page that doesnt exist', async () => {
    const url = `/api/page/by-id/${fakeId}`;
    const response = await agent.delete(url).expect(403);

    expect(response.body.status).equal('error');
  });
  
  it('Delete the new page without token', async () => {
    const url = `/api/page/by-id/${id}`;
    const response = await agent.delete(url).expect(403);

    expect(response.body.status).equal('error');
  });
  
  it('Delete the new page with valid token', async () => {
    const url = `/api/page/by-id/${id}?token=${token}`;
    const response = await agent.delete(url).expect(200);

    expect(response.body.status).to.be.ok;
  });
  
  it('Check if page was deleted', async () => {
    const url = '/api/page';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.pages.length).to.be.equals(pages.length);
  });

});