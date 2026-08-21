const test = require('node:test');
const assert = require('node:assert/strict');
const { scoreJob } = require('../src/services/recommendationService');

test('scores matching skills without case sensitivity', () => {
  assert.equal(scoreJob(['React', 'CSS'], ['react', 'Node.js', 'css']), 67);
});

test('returns zero for jobs without skills', () => {
  assert.equal(scoreJob(['React'], []), 0);
});
