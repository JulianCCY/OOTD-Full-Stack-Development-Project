'use strict';
const url = 'https://localhost:8000'; // change url when uploading to server

// select existing html elements
const uploadForm = document.querySelector('#uploadForm');
const userList = document.querySelector('.add-owner');

// submit add cat form
uploadForm.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  const fd = new FormData(uploadForm);
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
    body: fd,
  };
  const response = await fetch(url + '/post', fetchOptions);
  const json = await response.json();
  alert(json.message);
  location.href = 'home.html';
});