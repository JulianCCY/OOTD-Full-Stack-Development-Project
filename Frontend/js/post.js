'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

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
  alert(json.message);
  location.href = 'home.html';
});