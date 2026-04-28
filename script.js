function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;

    const progress = Math.min(timeElapsed / duration, 1);

    // easing (biar halus, bukan linear)
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

function scrollToSection(id) {
  const target = document.getElementById(id);
  smoothScrollTo(target.offsetTop, 1000); // bisa diubah durasinya
}

function scrollNext(el) {
  const currentSection = el.closest("section");
  const nextSection = currentSection.nextElementSibling;

  if (nextSection) {
    smoothScrollTo(nextSection.offsetTop, 1000);
  }
}

const comfortMessages = [
  "hey, kamu lagi kepikiran ya?",
  "it’s okay, you don’t have to figure everything out tonight",
  "aku disini yaa sayangg",
  "jangan lupa istirahat yaa",
  "you’re doing okay, seriously",
  "breathe dulu yaa, pelan-pelan",
  "kamu gak harus selalu kuat kok",
];

const usMoments = [
  "remember that random call yang harusnya bentar tapi jadi lama?",
  "kamu yang suka ngomel kalo aku main gamenya jelek",
  "kita yang sama-sama nangis kalo nonton film sedih",
  "our awkward but funny moments",
  "the way we can talk about nothing and still stay on call",
  "call di kereta sampe aku diliatin orang-orang 😭",
];

let comfortBag = [];
let usMomentBag = [];

function getFromBag(sourceArray, bagName) {
  if (bagName.length === 0) {
    bagName.push(...sourceArray);
  }

  const randomIndex = Math.floor(Math.random() * bagName.length);
  const item = bagName[randomIndex];

  bagName.splice(randomIndex, 1);

  return item;
}

function showComfortMessage() {
  showResult("comfortMessage", getFromBag(comfortMessages, comfortBag));
}

function showSleepCall() {
  showResult(
    "sleepCallMessage",
    "imagine we’re on call right now, you falling asleep first, and i’m still here, listening to your silence",
  );
}

function showUsMoment() {
  showResult("usMomentMessage", getFromBag(usMoments, usMomentBag));
}

window.addEventListener("DOMContentLoaded", () => {
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.2,
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));
});

function showResult(id, text) {
  const el = document.getElementById(id);
  el.classList.remove("show");

  setTimeout(() => {
    el.textContent = text;
    el.classList.add("show");
  }, 120);
}

const music = document.getElementById("bgMusic");
const toggle = document.getElementById("musicToggle");

let isPlaying = false;

// fade in function (biar halus banget)
function fadeIn(audio, duration = 1500) {
  audio.volume = 0;
  audio.play();

  let step = 0.05;
  let interval = duration / (1 / step);

  let fade = setInterval(() => {
    if (audio.volume < 0.4) {
      audio.volume = Math.min(audio.volume + step, 0.4);
    } else {
      clearInterval(fade);
    }
  }, interval);
}

// toggle button
toggle.addEventListener("click", () => {
  if (!isPlaying) {
    fadeIn(music);
    toggle.textContent = "🔊";
    isPlaying = true;
  } else {
    music.pause();
    toggle.textContent = "🔈";
    isPlaying = false;
  }
});

document.body.addEventListener(
  "click",
  () => {
    if (!isPlaying) {
      fadeIn(music);
      toggle.textContent = "🔊";
      isPlaying = true;
    }
  },
  { once: true },
);
