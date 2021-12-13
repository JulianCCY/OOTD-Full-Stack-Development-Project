'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// Search Bar
var toggle = 0;
const search = document.querySelector("#search");
const searchBar = document.querySelector(".searchBar");
search.addEventListener('click', () => {
    if (toggle === 0) {
        searchBar.classList.add("fadeInLeft");
        searchBar.classList.remove("fadeOut");
        toggle = 1;
    }
    else {
        searchBar.classList.add("fadeOut");
        searchBar.classList.remove("fadeInLeft");
        toggle = 0;
    }
});

// Nav Profile 
var profileToggle = 0;
const profile = document.querySelector("#profile");
const profileList = document.querySelector(".profile-list");
profile.addEventListener("click", () => {
  if (profileToggle === 0) {
    profileList.classList.add("down");
    profileList.classList.remove("up");
    profileToggle = 1;
  }
  else {
    profileList.classList.add("down");
    profileList.classList.add("up");
    profileToggle = 0;
  }
});

// Edit Profile
const editButton = document.querySelector("#editButton");
const editContainer = document.querySelector(".edit-profile");
const closeButton = document.querySelector("#closeButton");
const submitButton = document.querySelector("#confirmButton");

editButton.addEventListener("click", () => {
    editContainer.classList.add("open-form");
    editContainer.classList.remove("close-form");
});
closeButton.addEventListener("click", () => {
    editContainer.classList.add("close-form");
    editContainer.classList.remove("open-form");
});

// get user info
const user = JSON.parse(sessionStorage.getItem("user"));
console.log(user);

const profilePicture = document.querySelector(".profile-pic-container img");
const username = document.querySelector(".username");
const email = document.querySelector(".email");
const likes = document.querySelector(".likes");
const description = document.querySelector(".description");
const usernameInput = document.getElementById("username-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const descriptionInput = document.getElementById("description-input");


const webInfo = (info) => {
    if (info.profile_pic != null) {
        profilePicture.src = info.profile_pic;
    }
    username.innerHTML = info.username;
    usernameInput.setAttribute("value", info.username);
    email.innerHTML = info.email;
    emailInput.value = info.email;
    likes.innerHTML = info.likes + "likes";
    if (info.profile != null) {
        description.innerHTML = info.profile;
    }
    descriptionInput.value = info.profile;
}
webInfo(user);

// submit edit form
const editForm = document.querySelector("#editProfileForm");
editForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(editForm);
    for (const [prop, value] of Object.entries(data)) {
        if (value === '') {
          delete data[prop];
        }
    }
    const fetchOptions = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url + '/user/' + user.user_id, fetchOptions);
    const json = await response.json();
    alert(json.message);
    location.href = 'profile.html';
});