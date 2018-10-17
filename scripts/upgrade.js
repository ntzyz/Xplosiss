const child_process = require('child_process');
const fs = require('fs');
const path = require('path');

function getCurrentCommitHash () {
  return new Promise((resolve) => {
    child_process.exec('git rev-parse HEAD', (err, stdout) => {
      resolve(stdout.trim());
    });
  });
}

function evalGitPull () {
  return new Promise((resolve) => {
    child_process.exec('git pull', (err, stdout) => {
      resolve(stdout.trim());
    });
  });
}

function getCommitSinceHash (hash) {
  return new Promise((resolve) => {
    child_process.exec(`git rev-list ${hash}..HEAD`, (err, stdout) => {
      resolve(stdout.split('\n'));
    });
  });
}

function evalBuildBundle () {
  return new Promise((resolve) => {
    const cp = child_process.spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
    });
    cp.on('close', (code) => {
      resolve();
    });
  });
}

async function main () {
  const currentCommitHash = await getCurrentCommitHash();
  console.log(`Current HEAD is ${currentCommitHash}`);

  console.log('Fetching the latest code...');
  await evalGitPull();

  const hashs = [
    currentCommitHash,
    ...await getCommitSinceHash(currentCommitHash),
  ];

  console.log(hashs);

  console.log('Checking scripts to run...');
  for (const hash of hashs) {
    if (fs.existsSync(path.join(__dirname, `./${hash}.js`))) {
      try {
        await require(`./${hash}.js`)();
      } catch (e) {
        console.log(`Error on running ${hash}.js: ${e}`);
        process.exit(1);
      }
      console.log(`${hash} => ok!`);
    }
  }

  console.log('Building frontend bundles...');
  await evalBuildBundle();

  console.log('All done.');
  process.exit(0);
}

main();