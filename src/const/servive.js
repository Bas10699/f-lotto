export const ip = "https://cors-anywhere.herokuapp.com/https://api.krupreecha.com/"

export const get = (path) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': '8bebfb75a931bd796d5678a93f8064bc'

        }
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})

export const post = (object, path) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': '8bebfb75a931bd796d5678a93f8064bc'
        },
        body: JSON.stringify(object)
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})