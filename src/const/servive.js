// export const ip = "https://cors-anywhere.herokuapp.com/https://api.krupreecha.com/"
// export const ip = "https://f-lotto.herokuapp.com/"
export const ip = "https://thai-lottery1.p.rapidapi.com/"

// fetch("https://thai-lottery1.p.rapidapi.com/?date=16052564", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "thai-lottery1.p.rapidapi.com",
// 		"x-rapidapi-key": "7f80f2652emsh55aaf3488555bcfp19f0edjsn5f2c0587785f"
// 	}
// })

export const get = (path) => new Promise((resolve, reject) => {
    fetch(ip + path, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "x-rapidapi-host": "thai-lottery1.p.rapidapi.com",
            "x-rapidapi-key": "7f80f2652emsh55aaf3488555bcfp19f0edjsn5f2c0587785f"

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
        },
        body: JSON.stringify(object)
    }).then(res => {
        setTimeout(() => null, 0);
        return res.json()
    }).then(json => {
        resolve(json);
    }).catch((err) => reject(err))
})