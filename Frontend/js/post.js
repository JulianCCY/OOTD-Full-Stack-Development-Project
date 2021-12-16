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

document.querySelector(".searchBar").addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const fetchOptions = {
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    },
  };
  try {
    const response = await fetch(url + '/user', fetchOptions);
    const json = await response.json();
    console.log(json);
    console.log(document.querySelector(".searchBar input").value);
    json.forEach((user) => {
      if(document.querySelector(".searchBar input").value === user.username) {
        window.location.href = `profile.html?id=${user.user_id}`
      } else {
        Swal.fire({
          icon: "question",
          title: "User not found.",
        });
      }
    });
  } catch (e) {
    console.log(e.message);
  }
});

// Profile 
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

// select existing html elements
const uploadForm = document.querySelector('#uploadForm');
const categoryList = document.querySelector('.category');

// create user options to <select>
const categoryOptions = (categories) => {
  // clear user list
  categoryList.innerHTML = '';
  categories.forEach((category) => {
    // create options with DOM methods
    const option = document.createElement('option');
    option.value = category.cid;
    option.innerHTML = category.category;
    option.classList.add('light-border');
    categoryList.appendChild(option);
  });
};

// get categories options
const getCategories = async () => {
  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      },
    };
    const response = await fetch(url + '/category', options);
    const categories = await response.json();
    categoryOptions(categories);
  } catch (e) {
    console.log(e.message);
  }
};
getCategories();

// submit upload form
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
  alert("Post uploaded successfully.");
  location.href = 'home.html';
});