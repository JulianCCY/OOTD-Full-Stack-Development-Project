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
          window.location.href = `profile.html?id=${user.user_id}`
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

// Create categories
const categoriesUL = document.querySelector('#categories-list');
const createCategories = (categories) => {
    // clear ul
    categoriesUL.innerHTML = '';
    categories.forEach((category) => {
      // create li with DOM methods
      const categoryImg = document.createElement('img');
      switch (category.category) {
        case 'Vintage':
            categoryImg.src = './img/Vintage.png';
            break; 
        case 'Vintage 80s':
            categoryImg.src = './img/80s.jpeg';
            break;
        case 'Vintage 90s':
            categoryImg.src = './img/90s.jpeg';
            break;
        case 'Casual':
            categoryImg.src = './img/Casual.jpeg';
            break;
        case 'GO-TO':
            categoryImg.src = './img/GO-TO.jpeg';
            break;
        case 'Affordable':
            categoryImg.src = './img/Affordable.jpeg';
            break;
        case 'Formal':
            categoryImg.src = './img/Formal.jpeg';
            break;
        case 'Spring Essentials':
            categoryImg.src = './img/Spring.jpeg';
            break;
        case 'Summer Pickups':
            categoryImg.src = './img/Summer.jpeg';
            break;
        case 'Get Fall Ready':
            categoryImg.src = './img/Fall.jpeg';
            break;
        case 'Winter Essentials':
            categoryImg.src = './img/winter.jpeg';
            break;
        case 'Christmas (Season Limited)':
            categoryImg.src = './img/Christmas.jpeg';
            break;
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

      // Get posts of that category
      categoryFigure.addEventListener('click', async () => {
        console.log(`clicked ${category.category}`);
        document.querySelector('#list').innerHTML = "";
        getPost(category.cid);
        setTimeout(() => {document.getElementById("secPosts").scrollIntoView()}, 200);
      });
    });
  };
  
  // AJAX call for categories
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
      createCategories(categories);
    } catch (e) {
      console.log(e.message);
    }
  };
  getcategories();

// Create posts
const ul = document.querySelector('#list');
const createPosts = (posts) => {
    // clear ul
    ul.innerHTML = '';
    posts.forEach((post) => {
      // create li with DOM methods
      const img = document.createElement('img');
      img.src = url + '/' + post.image;
      img.alt = post.id;
      img.classList.add('resp');
  
      const figure = document.createElement('figure').appendChild(img);

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img-container");
      imgContainer.appendChild(figure);
  
      const proImg = document.createElement("img");
      if (post.profile_pic === null) {
        proImg.src = "./img/DefaultProfilePic.png";
      }
      else {
        proImg.src = url + "/" + post.profile_pic;
      }
      const proPic = document.createElement("figure").appendChild(proImg);
      
      const p1 = document.createElement('a');
      p1.href = `profile.html?id=${post.user_id}`;
      p1.innerHTML = `${post.username}`;

      const usernameContainer = document.createElement("div");
      usernameContainer.classList.add("username-container");
      usernameContainer.appendChild(proPic);
      usernameContainer.appendChild(p1);
  
      const li = document.createElement('li');
      li.classList.add('light-border');
      p1.classList.add("username");
  
      li.appendChild(usernameContainer);
      li.appendChild(imgContainer);
      ul.appendChild(li);

        // admin delete post
        if (user.role === 0) {
        // delete selected cat
        const delButton = document.createElement('button');
        delButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delButton.classList.add('delete-button');
        delButton.addEventListener('click', async () => {
          const fetchOptions = {
            method: 'DELETE',
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('token'),
            },
          };
          try {
            const response = await fetch(
              url + '/post/' + post.post_id,
              fetchOptions
            );
            const json = await response.json();
            getPost(post.cid);
          } catch (e) {
            console.log(e.message);
          }
        });
        li.appendChild(delButton);
      }
    });
  };
  
  // AJAX call
  const getPost = async (cid) => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/category/' + cid, fetchOptions);
      const posts = await response.json();
      if (posts.message === "None") {
          alert("No posts found");
      } else {
        createPosts(posts);
      }
    } catch (e) {
      console.log(e.message);
    }
};