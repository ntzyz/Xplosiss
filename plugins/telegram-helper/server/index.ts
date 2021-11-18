import axios from 'axios';
import geoip from 'geoip-lite';

function installer ({ site, utils, config }: PluginOptions) {
  const eventBus = utils.eventBus;

  eventBus.on(eventBus.EVENT_NEW_REPLY, params => {
    const name = params.pageSlug || params.postSlug;
    const URL = config.url + (params.pageSlug ? `/${params.pageSlug}` : `/post/${params.postSlug}`);
    const ipInfo = geoip.lookup(params.ipAddr);
    
    let ipRegion = [];
    if (ipInfo) {
      if (ipInfo.country) {
        ipRegion.push(ipInfo.country);
      }
      if (ipInfo.region) {
        ipRegion.push(ipInfo.region);
      }
      if (ipInfo.city) {
        ipRegion.push(ipInfo.city);
      }
    } else {
      ipRegion.push('unknown');
    }

    axios.post(`https://api.telegram.org/bot${config.plugins['telegram-helper'].telegramBotToken}/sendMessage`, {
      chat_id: config.plugins['telegram-helper'].ownerId,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text: [
        '<b>You have a new reply!</b>',
        `From: ${params.user}${params.email ? ` (${params.email})` : ''}`,
        `Link: <a href="${URL}">${name}</a>`,
        `IP Address: ${params.ipAddr} (${ipRegion.join('/')})`,
        'Content:',
        `${params.content}`,
      ].join('\n'),
    }).catch(_ => _);
  });

  eventBus.on(eventBus.EVENT_TOKEN_FORGOT, params => {
    axios.post(`https://api.telegram.org/bot${config.plugins['telegram-helper'].telegramBotToken}/sendMessage`, {
      chat_id: config.plugins['telegram-helper'].ownerId,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
      text: `Your access token is <code>${utils.token}</code>`,
    }).catch(_ => _);
  });
}

export default installer;
