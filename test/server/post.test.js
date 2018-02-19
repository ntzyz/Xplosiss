'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;

let agent = supertest.agent(require('../../index'));
let token = require('../../utils').token;

describe('Testing post-related APIs.', () => {
  let posts, id;
  let postTemplate = {
    title: 'hello world',
    slug: 'foo-bar',
    category: 'emmmm',
    date: new Date(),
    tags: ['233', '666'],
    content: {
      encoding: 'html',
      content: 'div 233'
    },
    replies: [],
  };
  const replyTemplate = {
    user: 'foo',
    email: 'bar@foo.baz',
    site: 'localhost.localdomain',
    content: 'Fork you!',
    datetime: new Date().getTime(),
  };

  it('Fetch post list', async () => {
    const url = '/api/post';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.posts).not.to.be.undefined;

    posts = response.body.posts;
  });

  it('Create new post without token', async () => {
    const url = '/api/post';
    const response = await agent.put(url).set('Content-Type', 'application/json').send(postTemplate).expect(403);

    expect(response.body.status).equal('error');
  });

  it('Create new post with valid token', async () => {
    const url = `/api/post?token=${token}`;
    const response = await agent.put(url).set('Content-Type', 'application/json').send(postTemplate).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.id).not.to.be.undefined;

    id = response.body.id;
  });

  it('Check if new post is created by slug', async () => {
    const url = `/api/post/by-slug/${postTemplate.slug}`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.post).not.to.be.undefined;
  });  

  it('Check if new post is created by id', async () => {
    const url = `/api/post/by-id/${id}/raw`;
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.post).not.to.be.undefined;
  });  

  it('Fetch a post by slug which dosent exist', async () => {
    const url = '/api/post/by-slug/fork-you';
    const response = await agent.get(url).expect(404);

    expect(response.body.status).equal('error');
  });  

  it('Get a post with invalid id', async () => {
    const url = '/api/post/by-id/123456/raw';
    const response = await agent.get(url).expect(500);

    expect(response.body.status).equal('error');
  });  

  it('Add a reply to one post', async () => {
    const url = `/api/post/by-slug/${postTemplate.slug}/reply`;
    const response = await agent.put(url).set('Content-Type', 'application/json').send(replyTemplate).expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Add another reply to one post', async () => {
    const url = `/api/post/by-slug/${postTemplate.slug}/reply`;
    const response = await agent.put(url).set('Content-Type', 'application/json').send(replyTemplate).expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Update the new post without token', async () => {
    const url = `/api/post/by-id/${id}`;
    const response = await agent.post(url).set('Content-Type', 'application/json').send(postTemplate).expect(403);

    expect(response.body.status).equal('error');
  });

  it('Update the new post with valid token', async () => {
    const url = `/api/post/by-id/${id}?token=${token}`;
    const response = await agent.post(url).set('Content-Type', 'application/json').send(postTemplate).expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Update the new post with valid token but invalid id', async () => {
    const url = `/api/post/by-id/233666?token=${token}`;
    const response = await agent.post(url).set('Content-Type', 'application/json').send(postTemplate).expect(500);

    expect(response.body.status).equal('error');
  });

  it('Check post rendering', async () => {
    let response;
    const url = `/api/post/by-slug/${postTemplate.slug}`;
    // Update encoding to 'html'
    postTemplate.content.encoding = 'html';
    postTemplate.content.content = '<!-- more --><code lang="js">\nconsole.log("hello world");</code>';
    response = await agent.post(`/api/post/by-id/${id}?token=${token}`).set('Content-Type', 'application/json').send(postTemplate).expect(200);

    response = await agent.get(url).expect(200);
    expect(response.body.status).to.be.ok;
    expect(response.body.post).not.to.be.undefined;

    // Update encoding to 'jade'
    postTemplate.content.encoding = 'jade';
    postTemplate.content.content = '// more \ncode(lang="js").\n  console.log("hello world");\n';
    await agent.post(`/api/post/by-id/${id}?token=${token}`).set('Content-Type', 'application/json').send(postTemplate).expect(200);

    response = await agent.get(url).expect(200);
    expect(response.body.status).to.be.ok;
    expect(response.body.post).not.to.be.undefined;

    // Update encoding to 'markdown'
    postTemplate.content.encoding = 'markdown';
    postTemplate.content.content = '<!-- more -->\n```js\nconsole.log("hello world");</code>\n```';
    await agent.post(`/api/post/by-id/${id}?token=${token}`).set('Content-Type', 'application/json').send(postTemplate).expect(200);

    response = await agent.get(url).expect(200);
    expect(response.body.status).to.be.ok;
    expect(response.body.post).not.to.be.undefined;
  });

  it('Delete the new post without token', async () => {
    const url = `/api/post/by-id/${id}`;
    const response = await agent.delete(url).expect(403);

    expect(response.body.status).equal('error');
  });

  it('Delete the new post with valid token', async () => {
    const url = `/api/post/by-id/${id}?token=${token}`;
    const response = await agent.delete(url).expect(200);

    expect(response.body.status).to.be.ok;
  });

});