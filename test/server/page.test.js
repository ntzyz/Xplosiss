'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../index'));
let token = require('../../utils').token;

describe('Testing page-related APIs.', () => {
  const pageTemplate = {
    title: 'Hello World',
    slug: 'hello-world',
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
  let pages;
  let id;

  it('Fetch page list', async () => {
    const url = '/api/page';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.pages).not.to.be.undefined;

    pages = response.body.pages;
  });

  it('Create new page', async () => {
    const url = `/api/page?token=${token}`;
    const response = await agent.put(url)
      .set('Content-Type', 'application/json')
      .send(pageTemplate)
      .expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body._id).not.to.be.undefined;

    id = response.body._id;
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

  it('Delete the new page', async () => {
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