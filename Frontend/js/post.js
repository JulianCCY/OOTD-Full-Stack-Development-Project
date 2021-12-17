'use strict';
const url = 'http://10.114.32.122/app'; // change url when uploading to server

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
        window.location.href = `profile.html?id=${user.user_id}`;
        return;
      } 
    });
    alert("User with inserted username not found. \nCase sensitive.")
    document.querySelector(".searchBar input").value = "";
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

// select file js
const file = document.querySelector('.file');
file.addEventListener('change', (e) => {
  // Get the selected file
  const [file] = e.target.files;
  // Get the file name and size
  const { name: fileName, size } = file;
  // Convert size in bytes to kilo bytes
  const fileSize = (size / 1000).toFixed(2);
  // Set the text content
  const fileNameAndSize = `${fileName} - ${fileSize}KB`;
  document.querySelector('.file-name').textContent = fileNameAndSize;
});

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