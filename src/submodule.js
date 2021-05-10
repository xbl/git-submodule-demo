const URL = require('url');

const getSubmoduleList = function(str) {
    const result = [];
    if (!str) return result;
    const prefix = '[submodule "';
    const suffix = '"]';
    const pathPrefix = 'path = ';
    const urlPrefix = 'url = ';
    const lines = str.split('\n');
    const map = {};

    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(prefix)) continue ;
        const name = line.substring(line.indexOf(prefix) + prefix.length, line.lastIndexOf(suffix));
        const pathLine = lines[i + 1];
        if (!pathLine.includes(pathPrefix)) {
            throw new Error('缺少path');
        }
        const path = pathLine.trim().replace(pathPrefix, '');
        const url = lines[i + 2].trim().replace(urlPrefix, '');
        const { host, pathname } = URL.parse(url);
        const newUrl = host + pathname;
        if (map[newUrl]) {
            throw new Error('URL 相同');
        }
        const obj = {
            name,
            path,
            url
        };
        map[newUrl] = obj;
        result.push(obj);
    }


    return result;
};

exports.getSubmoduleList = getSubmoduleList;