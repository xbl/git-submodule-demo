const getSubmoduleList = function(str) {
    const result = [];
    if (!str) return result;
    const prefix = '[submodule "';
    const suffix = '"]';
    const pathPrefix = 'path = ';
    const urlPrefix = 'url = ';
    const lines = str.split('\n');
    for(let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line.includes(prefix)) continue ;
        const name = line.substring(line.indexOf(prefix) + prefix.length, line.lastIndexOf(suffix));
        const path = lines[i + 1].trim().replace(pathPrefix, '');
        const url = lines[i + 2].trim().replace(urlPrefix, '');
        const obj = {
            name,
            path,
            url
        };
        result.push(obj);
    }
    return result;
};

exports.getSubmoduleList = getSubmoduleList;