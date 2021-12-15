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

// Create categories
const categoriesUL = document.querySelector('#categories-list');
const createCategories = (categories) => {
    // clear ul
    categories.innerHTML = '';
    categories.forEach((category) => {
      // create li with DOM methods
      const categoryImg = document.createElement('img');
      switch (category.category) {
        case "Vintage":
            categoryImg.src = "./img/Vintage.png";
            break; 
        case "Vintage 80s":
            categoryImg.src = "./img/Vintage80s.jpg"
      }
      categoryImg.classList.add('categoryImgProps');
  
      const categoryFigure = document.createElement('figure').appendChild(categoryImg);

      const categoryImgContainer = document.createElement("div");
      categoryImgContainer.classList.add("categoryImgContainer");
      categoryImgContainer.appendChild(categoryFigure);

      const categoryName = document.createElement('h2');
      categoryName.innerHTML = `${category.category}`;
  
      const categoriesLI = document.createElement('li');
      categoriesLI.classList.add('category-container');
      categoryName.classList.add("categoryName");
  
      categoriesLI.appendChild(categoryName);
      categoriesLI.appendChild(categoryFigure);
      categoriesUL.appendChild(categoriesLI);
    });
  };
  
  // AJAX call
  const getcategories = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/category', fetchOptions);
      const categories = await response.json();
      categories.shift();
      console.log(categories);
      createCategories(categories);
    } catch (e) {
      console.log(e.message);
    }
  };
  getcategories();




// Create posts
const ul = document.querySelector('#list');