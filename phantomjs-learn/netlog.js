var page = require('webpage').create();
var system = require('system');
var address;

if(system.args.length === 1) {
  console.log('usage: netlog.js <some url>');
  page.exit(1);
}else {
  address = system.args[1];

  page.onResourceRequested = function(request) {
    console.log('Request ' + JSON.stringify(request, undefined, 4));
  };

  page.onResourceReceived = function( response ) {
    console.log('Receive ' + JSON.stringify(response, undefined, 4))
  }

  page.open(address, function(status) {
    if(status !== 'success') {
      console.log('fail to load the page!');
      page.exit();
    }
  })
}

