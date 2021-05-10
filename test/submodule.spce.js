const assert = require('assert');
const { getSubmoduleList } = require('../src/submodule');

it('Given 空字符串，When 调用 getSubmoduleList，Then 返回空数组 ', () => {
    const result = getSubmoduleList('');
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 0)
});