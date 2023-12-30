function createNode(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild; 
}

function getPath(path, object) {
    const keys = path.trim().split('.');
    const len = keys.length;
    let pointer = object;

    for (let i = 0; i < len; i++) {
        const key = keys[i];
        
        pointer = pointer[key];

        if (i < (len - 1) && typeof pointer !== 'object') {
            break;
        }
    }

    return pointer;
}

function setPath(path, value, object) {
    const keys = path.trim().split('.');
    const len = keys.length - 1;
    const lastKey = keys[len - 1];
    let pointer = object;

    for (let i = 0; i < len; i++) {
        const key = keys[i];
        
        pointer = pointer[key];

        if (i < (len - 1) && typeof pointer !== 'object') {
            break;
        }
    }

    pointer[lastKey] = value;
}