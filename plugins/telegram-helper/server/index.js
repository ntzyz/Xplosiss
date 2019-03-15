const axios = require('axios');

function installer ({ site, utils, config }) {
  const eventBus = utils.eventBus;

  eventBus.on(eventBus.EVENT_NEW_REPLY, params => {
    const name = params.pageSlug || params.postSlug;
    const URL = config.url + (params.pageSlug ? `/page/${params.pageSlug}` : `/post/${params.postSlug}`);

    axios.post(`https://api.telegram.org/bot${config.plugins['telegram-helper'].telegramBotToken}/sendMessage`, {
      chat_id: config.plugins['telegram-helper'].ownerId,
      parse_mode: 'HTML',
      text: `<b>You have a new reply!</b>\nFrom: ${params.user}\nLink: <a href="${URL}">${name}</a>\nIP Address: ${params.ipAddr}\nContent:\n${params.content}`,
    });
  });
}

module.exports = installer;
