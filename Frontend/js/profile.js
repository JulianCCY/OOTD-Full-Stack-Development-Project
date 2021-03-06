'use strict';
const url = 'http://10.114.32.122/app'; // change url when uploading to server

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

// Profile info -----------------------------------------------------------------------------------------------------------
const avatar = document.querySelector(".profile-pic"); 
const editPicture = document.querySelector(".edit-picture");
const pCloseButton = document.querySelector("#pictureCloseButton");
const pictureButton = document.querySelector("#pictureButton");
const editButton = document.querySelector("#editButton");
const editContainer = document.querySelector(".edit-profile");
const closeButton = document.querySelector("#closeButton");
const submitButton = document.querySelector("#confirmButton");

// Edit Picture container show up
avatar.addEventListener("click", () => {
    editPicture.classList.add("open-avatar-form");
    editPicture.classList.remove("close-avatar-form");
    document.querySelector(".sectionOverlay").classList.add("overlay");
});
pCloseButton.addEventListener("click", () => {
    editPicture.classList.add("close-avatar-form");
    editPicture.classList.remove("open-avatar-form");
    document.querySelector(".sectionOverlay").classList.remove("overlay");
});

// Edit Profile container show up
editButton.addEventListener("click", () => {
    editContainer.classList.add("open-form");
    editContainer.classList.remove("close-form");
    document.querySelector(".sectionOverlay").classList.add("overlay");
});
closeButton.addEventListener("click", () => {
    editContainer.classList.add("close-form");
    editContainer.classList.remove("open-form");
    document.querySelector(".sectionOverlay").classList.remove("overlay");
});

// update user info to web
const user = JSON.parse(sessionStorage.getItem("user"));
const profileHref = document.getElementById("profileHref");
profileHref.href = `profile.html?id=${user.user_id}`;

const profilePicture = document.querySelector(".profile-pic-container img");
const username = document.querySelector(".main-username");
const email = document.querySelector(".email");
const likes = document.querySelector(".totalLikes");
const posts = document.querySelector(".posts");
const description = document.querySelector(".description");

const webInfo = (info) => {
    if (info.profile_pic != null) {
        profilePicture.src = url + "/" + info.profile_pic;
    }
    username.innerHTML = info.username;
    email.innerHTML = info.email;
    likes.innerHTML = "Total " + info.totalNumOfLikes + " likes";
    posts.innerHTML = info.numOfOwnedPosts + " posts";
    if (info.profile != null) {
        description.innerHTML = info.profile;
    }
}

// get user info by html params
var params = new URL(window.location.href);
var id = params.searchParams.get("id");
// hide edit and setting buttons
const getUser = async () => {
    if (user.user_id != id) {
        document.getElementById("editButton").style.display = "none";
        document.getElementById("settingsButton").style.display = "none";
        avatar.style.pointerEvents = "none";
    }
    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
      };
      const response = await fetch(url + '/user/' + id, options);
      const users = await response.json();
      webInfo(users[0]);
    } catch (e) {
      console.log(e.message);
    }
};
getUser();

//  FORMS ------------------------------------------------------------------------------------------------------------
// sumbit avatar
const editPictureForm = document.querySelector("#editPictureForm");
editPictureForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(editPictureForm);
    const fetchOptions = {
        method: 'PUT',
        headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        },
        body: data,
    };
    const response = await fetch(url + '/user', fetchOptions);
    const json = await response.json();
    alert("Your profile picture has been changed successfully.");
    getUser();
});

// submit edit form
const editForm = document.querySelector("#editProfileForm");
editForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    if (document.getElementById("passwd").value != document.getElementById("passwdC").value) {
      message.innerHTML = "Passwords not match";
      return;
    } else {
        message.innerHTML = " ";
        const data = serializeJson(editForm);
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
        if (json.status === "invalid") {
            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("passwd").value = "";
            document.getElementById("passwdC").value = "";
        }
        if (json.status === "username") {
            document.getElementById("username").value = "";
        }
        if (json.status === "email") {
            document.getElementById("email").value = "";
        }
        if (json.status === "good") {
            document.getElementById("username").value = "";
            document.getElementById("email").value = "";
            document.getElementById("passwd").value = "";
            document.getElementById("passwdC").value = "";
            document.getElementById("description").value = "";
            alert("Profile has been updated.");
            getUser();
        }
    }
});

// Create posts ----------------------------------------------------------------------------
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
      
      const p1 = document.createElement('p');
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

        // admin or owner delete post
        if (user.role === 0 || user.username === post.username) {
            const delButton = document.createElement('button');
            delButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
            delButton.classList.add('delete-button');
            delButton.addEventListener('click', async () => {
              if (confirm("Are you sure you want to remove this post forever?")) {
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
      const response = await fetch(url + '/user/post/' + id, fetchOptions);
      const posts = await response.json();
      createPosts(posts);
    } catch (e) {
      console.log(e.message);
    }
  };
  getPost();