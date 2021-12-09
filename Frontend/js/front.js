'use strict';
// preload
$(document).ready(function() {
	
	setTimeout(function(){
		$('body').addClass('loaded');
        document.querySelector(".front").scrollIntoView();
	}, 1000);
});

// our names
const elts = {
    text1: document.getElementById("text1"),
    text2: document.getElementById("text2")
};

const texts = ["@Boris", "@Julian"];

const morphTime = 1;
const cooldownTime = 2.5;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
    morph -= cooldown;
    cooldown = 0;

    let fraction = morph / morphTime;

    if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
    }

    setMorph(fraction);
}

function setMorph(fraction) {
    elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    fraction = 1 - fraction;
    elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
    elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

    elts.text1.textContent = texts[textIndex % texts.length];
    elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
    morph = 0;

    elts.text2.style.filter = "";
    elts.text2.style.opacity = "100%";

    elts.text1.style.filter = "";
    elts.text1.style.opacity = "0%";
}

function animate() {
    requestAnimationFrame(animate);

    let newTime = new Date();
    let shouldIncrementIndex = cooldown > 0;
    let dt = (newTime - time) / 1000;
    time = newTime;

    cooldown -= dt;

    if (cooldown <= 0) {
        if (shouldIncrementIndex) {
            textIndex++;
        }
        doMorph();
    } else {
        doCooldown();
    }
}
animate();

// scrolling and fade
const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.9
  };
  
  function observerCallback(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // fade in observed elements that are in view
        entry.target.classList.replace('fadeOut', 'fadeIn');
      } else {
        // fade out observed elements that are not in view
        entry.target.classList.replace('fadeIn', 'fadeOut');
      }
    });
  }
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  const fadeElms = document.querySelectorAll('.fade');
  fadeElms.forEach(el => observer.observe(el));


// backend and fetch
const url = 'http://localhost:3000'; // change url when uploading to server

// select existing html elements
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = serializeJson(loginForm);
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };
  
    const response = await fetch(url + '/auth/login', fetchOptions);
    const json = await response.json();
    console.log('login response', json);
    if (!json.user) {
      alert(json.message);
    } else {
      // save token
      sessionStorage.setItem('token', json.token);
      sessionStorage.setItem('user', JSON.stringify(json.user));
      location.href = 'home.html';
    }
});
