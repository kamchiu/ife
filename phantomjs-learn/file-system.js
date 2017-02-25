const fs = require('fs');

const content = fs.read('ua.json');

console.log('data:' + content);

phantom.exit();