const URL = require('url');
const fs = require('fs');

const NAME_PREFIX = '[submodule "';
const PATH_PREFIX = 'path';
const URL_PREFIX = 'url';
const SEPARATOR = '=';
const SUB_MODULE_STEP = 3;

const getPath = (pathLine) => {
    if (!pathLine || !pathLine.trim().startsWith(PATH_PREFIX)) {
        throw new Error('缺少path');
    }
    return pathLine.split(SEPARATOR).pop().trim();
};

const getUrl = (urlLine) => {
    if (!urlLine || !urlLine.trim().startsWith(URL_PREFIX)) {
        throw new Error('缺少url');
    }
    return urlLine.split(SEPARATOR).pop().trim();
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
        const path = getPath(lines[i + 1]);
        const url = getUrl(lines[i + 2]);
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

