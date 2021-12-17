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

// Create posts
const ul = document.querySelector('#list');
const createPosts = (posts) => {
  // if no posts found and last post deleted
    if (posts.message === "Posts not found") {
      const nopost = document.createElement("h1");
      nopost.innerHTML = "No posts recently found on ootd."
      ul.innerHTML = "";
      ul.appendChild(nopost);
      return;
    }
    // if posts found, generate posts
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
  
      const p2 = document.createElement('p');
      if (post.liked === 0) {
        p2.innerHTML = `<i class="far fa-heart"></i> ${post.likes} likes`;
      } else {
        p2.innerHTML = `<i class="fas fa-heart" style="color: #e60000"></i> ${post.likes} likes`;
      }

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
        p2.classList.remove("like");
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
          console.log(json);
          p2.classList.add("like");
          if (json[1] === 0) {
            p2.innerHTML = `<i class="far fa-heart"></i> ${json[0]} likes`;
          } else {
            p2.innerHTML = `<i class="fas fa-heart" style="color: #e60000"></i> ${json[0]} likes`;
          }
        } catch (e) {
          console.log(e.message);
        }
      });

        // admin delete post
        if (user.role === 0) {
        const delButton = document.createElement('button');
        delButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        delButton.classList.add('delete-button');
        delButton.addEventListener('click', async () => {
          if (confirm("Are you sure you want to remove this post by ultimate admin power?")) {
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
              alert("Post deleted.");
              getPost();
            } catch (e) {
              console.log(e.message);
            }
          } else {
            alert("Nothing happened.");
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
  