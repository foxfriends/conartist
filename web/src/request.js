'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
function get(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.open('GET', url, true);
        xhr.send();
    });
}
exports.get = get;
function put(url, data) {
    const params = [];
    for (const key of Object.keys(data)) {
        params.push(`${key}=${data[key]}`.replace(' ', '%20'));
    }
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.responseText);
        xhr.onerror = () => reject(xhr.statusText);
        xhr.open('PUT', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(params.join('&'));
    });
}
exports.put = put;
