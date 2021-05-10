const URL = require('url');
const fs = require('fs');

const namePrefix = '[submodule "';
const pathPrefix = 'path';
const urlPrefix = 'url';
const separator = '=';
const subModuleStep = 3;

const getPath = (pathLine) => {
    if (!pathLine || !pathLine.trim().startsWith(pathPrefix)) {
        throw new Error('缺少path');
    }
    return pathLine.split(separator).pop().trim();
};

const getUrl = (UrlLine) => {
    if (!UrlLine || !UrlLine.trim().startsWith(urlPrefix)) {
        throw new Error('缺少url');
    }
    return UrlLine.split(separator).pop().trim();
};

const checkDuplicate = (url, map) => {
    const { host, pathname } = URL.parse(url);
    const newUrl = host + pathname;
    if (map[newUrl]) {
        throw new Error('URL 相同');
    }
    map[newUrl] = newUrl;
    return newUrl;
};

const getSubmoduleName = (line) => {
    if (!line.trim().startsWith(namePrefix)) {
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
        checkDuplicate(url, map);
        const submodule = {
            name,
            path,
            url
        };
        result.push(submodule);
        i = Math.min(i + subModuleStep, lines.length);
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

