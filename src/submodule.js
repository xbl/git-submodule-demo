const URL = require('url');
const fs = require('fs');

const prefix = '[submodule "';
const suffix = '"]';
const pathPrefix = 'path = ';
const urlPrefix = 'url = ';

const getPath = (pathLine) => {
    if (!pathLine.includes(pathPrefix)) {
        throw new Error('缺少path');
    }
    return pathLine.trim().replace(pathPrefix, '');
};

const getUrl = (UrlLine) => {
    if (!UrlLine.includes(urlPrefix)) {
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
    const lines = str.split('\n');
    const map = {};

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(prefix)) continue ;
        const name = line.substring(line.indexOf(prefix) + prefix.length, line.lastIndexOf(suffix));
        const path = getPath(lines[i + 1]);
        const url = getUrl(lines[i + 2]);
        checkDuplicate(url, map);
        const obj = {
            name,
            path,
            url
        };
        result.push(obj);
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

