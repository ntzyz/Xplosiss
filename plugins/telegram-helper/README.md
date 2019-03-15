Telegram Helper
===============

Send messages to a Telegram user through Telegram Bot API when needed.
This is a sample usage of the event system in this blog server.

## Configuration

1. Create a new bot (or use an exist bot with it's [authentication token](https://core.telegram.org/bots/api#authorizing-your-bot))
2. Update configuration file `config.js` with your bot authentication token and id of the message receiver.
3. Launch the blog server.

## Notes

If you are using a new bot just created, send `/start` command to it to make this bot able to send message to you.
Otherwise Telegram will return an Error and your blog will crash.