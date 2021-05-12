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

it('Given 多行submodule 字符串，When 调用 getSubmoduleList，Then 返回 包含submodule 的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path = pathleg
        url = https://git.oschina.net/gaofeifps/leg.git
    [submodule "leg1"]
        path = pathleg1
        url = https://git.oschina.net/gaofeifps/leg1.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 2);
    const submodule = result[1];
    assert.equal(submodule.name, 'leg1');
    assert.equal(submodule.path, 'pathleg1');
    assert.equal(submodule.url, 'https://git.oschina.net/gaofeifps/leg1.git');
});

it('Given 多行submodule 字符串 And submodule 之间存在空行，When 调用 getSubmoduleList，Then 返回 包含submodule 的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path = pathleg
        url = https://git.oschina.net/gaofeifps/leg.git

        
    [submodule "leg1"]
        path = pathleg1
        url = https://git.oschina.net/gaofeifps/leg1.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 2);
    const submodule = result[1];
    assert.equal(submodule.name, 'leg1');
    assert.equal(submodule.path, 'pathleg1');
    assert.equal(submodule.url, 'https://git.oschina.net/gaofeifps/leg1.git');
});

it('Given 多行submodule 字符串 And URL 重复，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg.git
            [submodule "leg1"]
                path = pathleg1
                url = https://git.oschina.net/gaofeifps/leg.git
            `);
        },
        {
            name: 'Error',
            message: 'URL 相同'
        }
    );
});

it('Given 多行submodule 字符串 And URL 前缀不同 And URL 重复，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg.git
            [submodule "leg1"]
                path = pathleg1
                url = http://git.oschina.net/gaofeifps/leg.git
            `);
        },
        {
            name: 'Error',
            message: 'URL 相同'
        }
    );
});

it('Given 多行submodule 字符串 And 缺少 path，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg.git
            [submodule "leg1"]
                url = http://git.oschina.net/gaofeifps/leg.git
            `);
        },
        {
            name: 'Error',
            message: '缺少path'
        }
    );
});

it('Given 多行submodule 字符串 And 缺少 url，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg.git
            [submodule "leg1"]
                path = pathleg
            `);
        },
        {
            name: 'Error',
            message: '缺少url'
        }
    );
});

it('Given 多行submodule 字符串 And 缺少 name，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg.git
                path = pathleg
                url = https://git.oschina.net/gaofeifps/leg2.git
            `);
        },
        {
            name: 'Error',
            message: '缺少name'
        }
    );
});

it('Given 正确submodule 字符串 And path 与等号之间无空格，When 调用 getSubmoduleList，Then 返回 包含submodule 名字的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path=pathleg
        url = https://git.oschina.net/gaofeifps/leg.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'leg');
    assert.equal(result[0].path, 'pathleg');
});

it('Given 正确submodule 字符串 And url 与等号之间无空格，When 调用 getSubmoduleList，Then 返回 包含submodule 名字的对象数组 ', () => {
    const result = getSubmoduleList(`
    [submodule "leg"]
        path=pathleg
        url=https://git.oschina.net/gaofeifps/leg.git
    `);

    assert.equal(Array.isArray(result), true);
    assert.equal(result.length, 1);
    assert.equal(result[0].name, 'leg');
    assert.equal(result[0].url, 'https://git.oschina.net/gaofeifps/leg.git');
});

it('Given submodule 字符串 path，When 调用 getSubmoduleList，Then 抛出异常 ', () => {
    assert.throws(
        () => {
            getSubmoduleList(`
            [submodule "leg"]
            `);
        },
        {
            name: 'Error',
            message: '缺少path'
        }
    );
});