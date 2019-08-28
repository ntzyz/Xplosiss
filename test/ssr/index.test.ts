'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';
import config from '../../config';
import { fstat, existsSync } from 'fs';
import { join } from 'path';

const agent = supertest.agent(site);
const token = utils.token;

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

    const url = `/category/${encodeURIComponent(categories[0])}`;
    const response = await agent.get(url).expect(200);
  });

  it('Get favicon.ico', async () => {
    const url = '/favicon.ico';
    let expectedHttpStatusCode: number = 404;

    if (config.favicon && existsSync(join(__dirname, '../..', config.favicon))) {
      expectedHttpStatusCode = 200;
    }

    const response = await agent.get(url).expect(expectedHttpStatusCode);
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
    const rssCOnfig = config.plugins['rss-feed'];

    if (!rssCOnfig || !rssCOnfig.enabled) {
      return;
    }

    await agent.get('/feeds').expect(200);
  });

  it('Render Gallery', async () => {
    const galleryConfig = config.plugins as any;

    if (!galleryConfig || !galleryConfig.enabled) {
      return;
    }

    await agent.get(galleryConfig.mountPoint).expect(200);
  });

});
