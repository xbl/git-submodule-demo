const URL = require('url');
const fs = require('fs');

const NAME_PREFIX = '[submodule "';
const ATTR_PREFIX = {
    PATH: 'path',
    URL: 'url'
};
const SEPARATOR = '=';
const SUB_MODULE_STEP = 3;

const getValueByKey = (key, line) => {
    if (!line || !line.trim().startsWith(key)) {
        throw new Error(`缺少${key}`);
    }
    return line.split(SEPARATOR).pop().trim();
};

const checkDuplicateByURL = (url, map) => {
    const { host, pathname } = URL.parse(url);
    const newUrl = host + pathname;
    if (map[newUrl]) {
        throw new Error('URL 相同');
    }
    map[newUrl] = newUrl;
    return newUrl;
};

const getSubmoduleName = (line) => {
    if (!line.trim().startsWith(NAME_PREFIX)) {
        throw new Error('缺少name');
    }
    return line.replace(/\[submodule \"(\w+)\s*\"\]/, '$1').trim();
};

const getSubmoduleList = function(str) {
    const result = [];
    if (!str) return result;
    const lines = str.trim().split('\n');
    const map = {};
    let i = 0;
    while(i < lines.length) {
        const name = getSubmoduleName(lines[i]);
        const path = getValueByKey(ATTR_PREFIX.PATH, lines[i + 1]);
        const url = getValueByKey(ATTR_PREFIX.URL, lines[i + 2]);
        checkDuplicateByURL(url, map);
        const submodule = {
            name,
            path,
            url
        };
        result.push(submodule);
        i = Math.min(i + SUB_MODULE_STEP, lines.length);
    }

    return result;
};

const readSubmoduleFile = (submoduleFilePath) => {
    const str = fs.readFileSync(submoduleFilePath, 'utf-8');
    return getSubmoduleList(str);
}

console.log(readSubmoduleFile('./.gitsubmodule'));

module.exports = {
    getSubmoduleList,
    readSubmoduleFile
};

