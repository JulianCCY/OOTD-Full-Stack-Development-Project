'use strict';
const url = 'http://10.114.32.122/app'; //change url when uploading to server

const registerForm = document.querySelector('#registerForm');

const message = document.getElementById("message");

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (document.getElementById("passwd").value != document.getElementById("passwdC").value) {
      message.innerHTML = "Passwords not match";
      return false;
    } else {
      message.innerHTML = " ";
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
      alert(json.message);
      if (json.status === "invalid") {
        document.getElementById("username").value = "";
        document.getElementById("email").value = "";
        document.getElementById("passwd").value = "";
        document.getElementById("passwdC").value = "";
      }
      if (json.status === "username") {
        document.getElementById("username").value = "";
      }
      if (json.status === "email") {
        document.getElementById("email").value = "";
      }
      if (json.status === "good") {
        location.href = 'front.html';
      }
    }
});