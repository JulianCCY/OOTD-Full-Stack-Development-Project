'use strict';
const url = 'http://localhost:3000'; // change url when uploading to server

// Search Bar
var toggle = 0;
const search = document.querySelector("#search");
const searchBar = document.querySelector(".searchBar");
search.addEventListener('click', () => {
    console.log("clicked");
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
      img.addEventListener('click', () => {
        location.href = 'single.html?id=' + post.post_id;
      });
  
      const figure = document.createElement('figure').appendChild(img);
  
    //   const h2 = document.createElement('h2');
    //   h2.innerHTML = cat.name;
  
      const p1 = document.createElement('p');
      p1.innerHTML = `${post.username}`;
  
      const p2 = document.createElement('p');
      p2.innerHTML = `${post.likes} likes`;
  
      const p3 = document.createElement('p');
      p3.innerHTML = `${post.description}`;
  
      const li = document.createElement('li');
      li.classList.add('light-border');
      p1.classList.add("username");
  
    //   li.appendChild(h2);
      li.appendChild(p1);
      li.appendChild(figure);
      li.appendChild(p2);
      li.appendChild(p3);
      ul.appendChild(li);

        // if (user.role === 0 || user.user_id === post.owner) {
        // link to modify form
        // const modButton = document.createElement('a');
        // modButton.innerHTML = 'Modify';
        // modButton.href = `modify-cat.html?id=${cat.cat_id}`;
        // modButton.classList.add('button');
  
        // admin delete post
        if (user.role === 1) {
        // delete selected cat
        const delButton = document.createElement('button');
        delButton.innerHTML = 'Delete';
        delButton.classList.add('button');
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
  
        li.appendChild(modButton);
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
  