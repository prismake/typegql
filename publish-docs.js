var ghpages = require('gh-pages');

ghpages.publish('docs/_book', () => {
  console.log('Done.');
});
