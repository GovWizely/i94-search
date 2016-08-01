const ghPages = require('gh-pages');
const path = require('path');

const root = path.join(__dirname, '..');

ghPages.publish(path.join(root, 'dist'));
