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
const editForm = document.querySelector(".edit-profile");
const closeButton = document.querySelector("#closeButton");
const submitButton = document.querySelector("#confirmButton");

editButton.addEventListener("click", () => {
    editForm.classList.add("open-form");
    editForm.classList.remove("close-form");
});
closeButton.addEventListener("click", () => {
    editForm.classList.add("close-form");
    editForm.classList.remove("open-form");
});