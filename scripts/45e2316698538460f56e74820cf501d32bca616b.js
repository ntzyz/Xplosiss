/**
 * Before this commit, the HTTP Referer saveds into the 'logs' collection
 * were not valid. We need to drop them all.
 */

const { db } = require('../utils');
const { ObjectID } = require('mongodb');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => {
    readline.question(query, (answer) => {
      resolve(answer);
    });
  });
}

module.exports = async function () {
  await db.prepare();

  const posts = await db.conn.collection('posts').find({}).project({ replies: 1 }).toArray();

  for (let post of posts) {
    if (!Array.isArray(post.replies) || post.replies.length === 0) {
      continue;
    }

    for (let i = 0; i < post.replies.length; i++) {
      const a = post.replies[i];
      if (a.deleted) {
        continue;
      }

      for (let j = i + 1; j < post.replies.length; j++) {
        const b = post.replies[j];
        if (b.deleted) {
          continue;
        }

        if (a.user === b.user && a.email === b.email
                              && a.site === b.site
                              && a.content === b.content
                              && a.githubId === b.githubId
                              && Math.abs(a.datetime - b.datetime) < 1000 * 60 * 2 /* 2 minutes */) {
          console.log(`:: Found duplicate reply (in post ${post._id}):`);
          console.log(':: A: \n:: > ' + JSON.stringify(a, null, '  ').replace(/\n/g, '\n:: > '));
          console.log(':: B: \n:: > ' + JSON.stringify(b, null, '  ').replace(/\n/g, '\n:: > '));

          const answer = await question(':: Delete? [Yn]');

          if (answer === '' || answer === 'y' || answer === 'Y') {
            const op = { $set: {} };

            op.$set[`replies.${j}.deleted`] = true;

            for (let k = j + 1; k < post.replies.length; k++) {
              if (post.replies[k].replyTo === j) {
                op.$set[`replies.${k}.replyTo`] = i;
              }
            }

            console.log(op);

            await db.conn.collection('posts').updateOne({
              _id: ObjectID(post._id),
            }, op);
            console.log(':: Deleted');
          } else {
            console.log(':: Skipping');
          }
        }
      }
    }
  }
};

