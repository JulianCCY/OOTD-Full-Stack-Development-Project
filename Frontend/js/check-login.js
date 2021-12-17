(async () => {
  'use strict';
  const url = 'http://10.114.32.122/app'; // change url when uploading to server

  // check session Storage
  if (!sessionStorage.getItem('token') || !sessionStorage.getItem('user')) {
    location.href = 'front.html';
    return;
  }
  // check if token valid
  try {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/user/token', fetchOptions);
    if (!response.ok) {
      location.href = 'logout.html';
    } else {
      const json = await response.json();
      sessionStorage.setItem('user', JSON.stringify(json.user));
    }
  } catch (e) {
    console.log(e.message);
  }
})();
