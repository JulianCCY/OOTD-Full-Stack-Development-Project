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
    alert("You have logged out \nThank you for using OOT:D");
    location.href = 'front.html';
  } catch (e) {
    console.log(e.message);
  }
})();
