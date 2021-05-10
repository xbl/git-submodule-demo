const assert = require('assert');
const { getSubmoduleList } = require('../src/submodule');

it('Given 空字符串，When 调用 getSubmoduleList，Then 返回空数组 ', () => {
    const result = getSubmoduleList('');
    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 0);
});

it('Given 正确submodule 字符串，When 调用 getSubmoduleList，Then 返回 包含submodule 名字的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path = leg
        url = https://git.oschina.net/gaofeifps/leg.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'leg');
});

it('Given 正确submodule 字符串，When 调用 getSubmoduleList，Then 返回 包含submodule 的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path = pathleg
        url = https://git.oschina.net/gaofeifps/leg.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    const submodule = result[0];
    assert.equal(submodule.name, 'leg');
    assert.equal(submodule.path, 'pathleg');
    assert.equal(submodule.url, 'https://git.oschina.net/gaofeifps/leg.git');
});