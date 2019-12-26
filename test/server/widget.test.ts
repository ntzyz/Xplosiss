'use strict';

import * as supertest from 'supertest';
import { expect } from 'chai';

import site from '../../index';
import utils from '../../utils';
import { BlogWidget } from '../../types/models';

const agent = supertest.agent(site);
const token = utils.token;

describe('Testing widget-related APIs.', () => {
  const widgetTemplate = {
    title: 'Hello World',
    content: 'Hello World',
    enabled: true,
  };
  let widgets: BlogWidget[];
  let id: string;

  it('Fetch enabled widget list', async () => {
    const url = '/api/widget';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.widgets).not.to.be.undefined;

    widgets = response.body.widgets;
  });

  it('Fetch all widget list', async () => {
    const url = '/api/widget/all';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.widgets).not.to.be.undefined;
    expect(response.body.widgets.length).not.to.lessThan(widgets.length);

    widgets = response.body.widgets;
  });

  it('Create new widget without token', async () => {
    const url = '/api/widget';
    const response = await agent.put(url).send(widgetTemplate).expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Create new widget', async () => {
    const url = `/api/widget?token=${token}`;
    const response = await agent.put(url).send(widgetTemplate).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body._id).not.to.be.undefined;
    id = response.body._id;
  });

  it('Check if widget is added', async () => {
    const url = '/api/widget/all';
    const response = await agent.get(url).expect(200);

    expect(response.body.status).to.be.ok;
    expect(response.body.widgets).not.to.be.undefined;
    expect(response.body.widgets.length).to.be.greaterThan(widgets.length);
  });

  it('Update the new widget without token', async () => {
    widgetTemplate.enabled = false;

    const url = `/api/widget/${id}`;
    const response = await agent.post(url).send(widgetTemplate).expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Update the new widget', async () => {
    widgetTemplate.enabled = false;

    const url = `/api/widget/${id}?token=${token}`;
    const response = await agent.post(url).send(widgetTemplate).expect(200);

    expect(response.body.status).to.be.ok;
  });

  it('Update a widget with invalid id', async () => {
    const url = `/api/widget/123123?token=${token}`;
    const response = await agent.post(url).send(widgetTemplate).expect(500);

    expect(response.body.status).equal('error');
  });
  
  it('Delete the new widget without token', async () => {
    const url = `/api/widget/${id}`;
    const response = await agent.delete(url).expect(403);

    expect(response.body.status).to.be.equal('error');
  });

  it('Delete the new widget', async () => {
    const url = `/api/widget/${id}?token=${token}`;
    const response = await agent.delete(url).expect(200);

    expect(response.body.status).to.be.ok;
    // eslint-disable-next-line require-atomic-updates
    id = null;
  });

  it('Delete a widget with invalid id', async () => {
    const url = `/api/widget/123123?token=${token}`;
    const response = await agent.delete(url).expect(500);

    expect(response.body.status).equal('error');
  });
  
});