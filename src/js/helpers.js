import { TIMEOUT_SEC } from "./config.js";

/* This function will return a new promise which will reject after a certain number
 * of seconds.
 * The way of use this function is to make a race between this timeout promise and the
 * promise that we want to set a deadline. Then whatever occurs first will win the race.
 * */
const timeout = function (s) {
    return new Promise(function (_, reject) {
      setTimeout(function () {
        reject(new Error(`Request took too long! Timeout after ${s} second`));
      }, s * 1000);
    });
  };

export const AJAX = async function(url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
    ? fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(uploadData),
      })
    : fetch(url);

    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
} catch (err) {
    throw err; // Throwing error so we can handle it where this function is called from
}
}

/*
export const getJSON = async function(url) {
    try {
        const fetchPromise = fetch(url);
        const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    } catch (err) {
        throw err; // Throwing error so we can handle it where this function is called from
    }
}

export const sendJSON = async function(url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err; // Throwing error so we can handle it where this function is called from
  }
}
*/