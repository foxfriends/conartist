'use strict';

export function get(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.open('GET', url, true);
    xhr.send();
  });
}

export function put(url: string, data: { [key: string]: any }): Promise<string> {
  const params: string[] = [];
  for(const key of Object.keys(data)) {
    params.push(`${key}=${data[key]}`.replace(' ', '%20'));
  }
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.statusText);
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params.join('&'));
  });
}
