'use strict';

const supertest = require('supertest');
const expect = require('chai').expect;
const config = require('../../config');

let agent = supertest.agent(require('../../index'));
let token = require('../../utils').token;

describe('Testing index-rendering with SSR', async () => {
  it('Render index', async () => {
    const url = '/';
    const response = await agent.get(url).expect(200);
  });

  it('Render tag view', async () => {
    // Fetch all tags first
    const tags = (await agent.get('/api/tag').expect(200)).body.tags;

    const url = `/tag/${tags[0].tag}`;
    const response = await agent.get(url).expect(200);
  });

  it('Render category view', async () => {
    // Fetch all categories first
    const categories = (await agent.get('/api/category').expect(200)).body.categories;

    const url = `/category/${categories[0]}`;
    const response = await agent.get(url).expect(200);
  });

  it('Get favicon.ico', async () => {
    const url = '/favicon.ico';
    const response = await agent.get(url).expect(config.favicon === null ? 404 : 200);
  });

  it('Get a page that doesnt exist', async () => {
    const url = '/blablaemm';
    const response = await agent.get(url).expect(302).expect('Location', '/not-found');
  });

  it('Render 404 page', async () => {
    const url = '/not-found';
    const response = await agent.get(url).expect(404);
  });

  it('Render RSS feeds', async () => {
    if (!config.plugins['rss-feed'].enabled) {
      return;
    }
    await agent.get('/feeds').expect(200);
  });

  it('Render Gallery', async () => {
    if (!config.plugins.gallery.enabled) {
      return;
    }
    await agent.get(config.plugins.gallery.mountPoint).expect(200);
  });

});
