'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// Nav ----------------------------------------------------------------------------------
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

// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));

// Profile href
const profileHref = document.getElementById("profileHref");
profileHref.href = `profile.html?id=${user.user_id}`;

//  DELETEEEEEEEEEEEE --------------------------------------------------------------------------------------------
const deleteButton = document.querySelector(".deleteButton");
deleteButton.addEventListener('click', async (evt) => {
    evt.preventDefault();
    const fetchOptions = {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      try {
        const response = await fetch(
          url + '/user/' + user.user_id, fetchOptions
        );
        console.log(response);
        const json = await response.json();
        console.log('delete response', json);
        location.href = 'logout.html';
      } catch (e) {
        console.log(e.message);
      }
});