'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

const registerForm = document.querySelector('#registerForm');

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(registerForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/auth/register', fetchOptions);
    const json = await response.json();
    console.log(json);
    alert(json.message);
    // location.href = 'front.html';
  });