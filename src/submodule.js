const getSubmoduleList = function(str) {
    if (!str) return [];
    const prefix = '[submodule "';
    const suffix = '"]';
    const repleaced = str.substring(str.indexOf(prefix) + prefix.length, str.lastIndexOf(suffix));
    const obj = {
        name: repleaced,
    };
    const result = [];
    result.push(obj);
    return result;
};

exports.getSubmoduleList = getSubmoduleList;