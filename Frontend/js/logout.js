'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

(async () => {
  try {
    const response = await fetch(url + '/auth/logout');
    const json = await response.json();
    console.log(json);
    // remove token
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    alert('屌你老母仲唔logout');
    location.href = 'front.html';
  } catch (e) {
    console.log(e.message);
  }
})();
