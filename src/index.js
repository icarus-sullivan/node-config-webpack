const config = require('config');


(async() => {
  console.log('config is', config);
  console.log('config api', config.get('api'));
  console.log('...and arn.id', config.get('arn.id'));

  config.has('api');
})();