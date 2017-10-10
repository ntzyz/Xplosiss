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
Server side:
```
% cp config.sample.js config.js
% vi config.js
```
Browser side:
```
% pushd src
% cp config.sample.js config.js
% vi config.js
% popd 
```

### 4. Import default database
```
% mongo localhost:27017/$database ./db.default.js
```
Note: replace `$database` with your real database.

### 5. Build the script bundle.
```
% npm run build
```
Note: you should always rebuild it after editing `/src/config.js` or merging from upstream.

### 6. Create a systemd unit

```
echo "
[Uint]
Description=A naive blog framework

[Service]
WorkingDirectory=$(pwd)
ExecStart=npm run start
" | sudo tee /lib/systemd/system/new-blog.service
```

### 7. Start the server and enable it to be started on startup.
```
% sudo systemctl enable new-blog.service
% sudo systemctl start new-blog.service
```
