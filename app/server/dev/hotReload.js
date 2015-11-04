import httpProxy from 'http-proxy';
import bundle from './bundle.js';

module.exports = function(app, host, port) {
  bundle(host, port);
  const proxy = httpProxy.createProxyServer();

  // It is important to catch any errors from the proxy or the
  // server will crash. An example of this is connecting to the
  // server when webpack is bundling
  proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
  });

  // Any requests to localhost:PORT/build is proxied
  // to webpack-dev-server
  app.all('/build/*', function (req, res) {
    proxy.web(req, res, {
        target: `http://${host}:${port}`
    });
  });

  // Cleaning up the temporary files created by hot code reloading
  const _cleanup = function(options={}) {
    const assets = fs.readdirSync('app/assets');
    const regex = /.*\.hot-update\.js(\.map)?/;
    assets.filter(function(asset) {
      return regex.test(asset);
    }).map(function(temporaryAsset) {
      fs.unlinkSync(`app/assets/${temporaryAsset}`);
    });
    if (options.exit) {
      process.exit();
    }
  };
  process.on('exit', _cleanup.bind(null));
  process.on('SIGINT', _cleanup.bind(null, {exit: true}));
};
