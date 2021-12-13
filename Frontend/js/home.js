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

// Create posts
const ul = document.querySelector('#list');
// get user data for admin check
const user = JSON.parse(sessionStorage.getItem('user'));

const createPosts = (posts) => {
    // clear ul
    ul.innerHTML = '';
    posts.forEach((post) => {
      // create li with DOM methods
      const img = document.createElement('img');
      // img.src = url + '/thumbnails/' + post.image;
      img.src = url + '/' + post.image;
      img.alt = post.id;
      img.classList.add('resp');
  
      // open image in single.html
      // img.addEventListener('click', () => {
      //   location.href = 'single.html?id=' + post.post_id;
      // });
  
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
      
      const p1 = document.createElement('p');
      p1.innerHTML = `${post.username}`;
  
      const p2 = document.createElement('p');
      p2.innerHTML = `<i class="far fa-heart"></i> ${post.likes} likes`;
  
      const p3 = document.createElement('p');
      p3.innerHTML = `${post.description}`;

      const p4 = document.createElement("p");
      var date = new Date(post.time_stamp);
      var d = date.toDateString().split(' ').slice(1).join(' ');
      p4.innerHTML = `${d}`

      const usernameContainer = document.createElement("div");
      usernameContainer.classList.add("username-container");
      usernameContainer.appendChild(proPic);
      usernameContainer.appendChild(p1);

      const info = document.createElement("div");
      info.classList.add("info");
      info.appendChild(p2);
      info.appendChild(p3);
      info.appendChild(p4);

      const hr = document.createElement("hr");
  
      const li = document.createElement('li');
      li.classList.add('light-border');
      p1.classList.add("username");
      p2.classList.add("likes");
      p3.classList.add("des");
      p4.classList.add("date");
  
      li.appendChild(usernameContainer);
      li.appendChild(hr);
      li.appendChild(imgContainer);
      li.appendChild(info);
      ul.appendChild(li);

      // functional likes
      p2.addEventListener("click", async () => {
        const fetchOptions = {
          method: 'POST',
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
          console.log('modify likes response', json);
          getPost();
        } catch (e) {
          console.log(e.message);
        }
      });

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
            console.log('delete response', json);
            getPost();
          } catch (e) {
            console.log(e.message);
          }
        });
        li.appendChild(delButton);
      }
    });
  };
  
  // AJAX call
  const getPost = async () => {
    try {
      const fetchOptions = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/post', fetchOptions);
      const posts = await response.json();
      createPosts(posts);
    } catch (e) {
      console.log(e.message);
    }
  };
  getPost();
  