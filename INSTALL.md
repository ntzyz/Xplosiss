# Installation

### 1. Prepare dependency

Install `MongoDB`, `Node.js` and `npm`. for Arch Linux:

```
% sudo pacman -S nodejs npm
% yay -S mongodb-bin mongodb-tools-bin
```

### 2. Clone this repositery and install node dependency

```
% git clone https://github.com/ntzyz/Xplosiss.git
% cd Xplosiss
% npm i
```

### 3. Edit config file
```
% cp config.sample.ts config.ts
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

For Linux user with systemd, create a systemd service is recommended:

```
% echo "
[Unit]
Description=A naive blog framework
After=network.target

[Service]
WorkingDirectory=$(pwd)
Environment="NODE_ENV=production"
ExecStart=$(which node) $(pwd)/.ts/index

[Install]
WantedBy=multi-user.target
" | sudo tee /lib/systemd/system/xplosiss.service
% sudo systemctl enable xplosiss.service
% sudo systemctl start xplosiss.service
```

Or if you just want to start the server in command-line environment:

```
npm run start
```
