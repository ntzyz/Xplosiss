# Installation

### 1. Prepare dependency

Install `MongoDB`, `Node.js` and `npm`. for Arch Linux:

```
% sudo pacman -S mongodb node npm
```

### 2. Clone this repositery and install node dependency

```
% git clone https://github.com/ntzyz/new-blog
% cd new-blog
% npm i
```

### 3. Edit config file
```
% cp config.sample.js config.js
% vi config.js
```

### 4. Import default database
```
% mongo localhost:27017/$database ./db.default.js
```
Note: replace `$database` with your real database name.

### 5. Build the script bundle.

For Unix-like environment:
```
% npm run build
```

For Windows:
```
> npm run bulid-win32
```

Note: you should **always** rebuild it after editing `config.js` or merging from upstream.

### 6. Start service

For Linux user with systemd init, create a systemd service is recommended:

```
% echo "
[Unit]
Description=A naive blog framework
After=network.target

[Service]
WorkingDirectory=$(pwd)
Environment="NODE_ENV=production"
ExecStart=$(which node) $(pwd)/index

[Install]
WantedBy=multi-user.target
" | sudo tee /lib/systemd/system/new-blog.service
% sudo systemctl enable new-blog.service
% sudo systemctl start new-blog.service
```

Or if you just want to start the server in command-line environment:

```
npm run start
```