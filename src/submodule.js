const URL = require('url');
const fs = require('fs');

const prefix = '[submodule "';
const pathPrefix = 'path = ';
const urlPrefix = 'url = ';

const getPath = (pathLine) => {
    if (!pathLine.includes(pathPrefix)) {
        throw new Error('缺少path');
    }
    return pathLine.trim().replace(pathPrefix, '');
};

const getUrl = (UrlLine) => {
    if (!UrlLine || !UrlLine.includes(urlPrefix)) {
        throw new Error('缺少url');
    }
    return UrlLine.trim().replace(urlPrefix, '');
};

const checkDuplicate = (url, map) => {
    const { host, pathname } = URL.parse(url);
    const newUrl = host + pathname;
    if (map[newUrl]) {
        throw new Error('URL 相同');
    }
    map[newUrl] = newUrl;
    return newUrl;
}

const getSubmoduleList = function(str) {
    const result = [];
    if (!str) return result;
    const lines = str.trim().split('\n');
    const map = {};
    let i = 0;
    while(i < lines.length) {
        const line = lines[i];
        if (!line.includes(prefix)) {
            throw new Error('缺少name');
        }
        const name = line.replace(/\[submodule \"(\w+)\s*\"\]/, '$1').trim();
        const path = getPath(lines[i + 1]);
        const url = getUrl(lines[i + 2]);
        checkDuplicate(url, map);
        const obj = {
            name,
            path,
            url
        };
        result.push(obj);
        i = Math.min(i + 3, lines.length);
    }

    return result;
};

const readSubmoduleFile = () => {
    const str = fs.readFileSync('./.gitsubmodule', 'utf-8');
    return getSubmoduleList(str);
}

console.log(readSubmoduleFile());

module.exports = {
    getSubmoduleList,
    readSubmoduleFile
};

