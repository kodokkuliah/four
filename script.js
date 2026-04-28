function smoothScrollTo(targetY, duration = 900) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;

    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
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

  if (target) {
    smoothScrollTo(target.offsetTop, 1000);
  }
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

function getFromBag(sourceArray, bag) {
  if (bag.length === 0) {
    bag.push(...sourceArray);
  }

  const randomIndex = Math.floor(Math.random() * bag.length);
  const item = bag[randomIndex];

  bag.splice(randomIndex, 1);

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

function showResult(id, text) {
  const el = document.getElementById(id);

  if (!el) return;

  el.classList.remove("show");

  setTimeout(() => {
    el.textContent = text;
    el.classList.add("show");
  }, 120);
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

  setupMusic();
});

function setupMusic() {
  const music = document.getElementById("bgMusic");
  const toggle = document.getElementById("musicToggle");

  if (!music || !toggle) return;

  let isPlaying = false;
  let fadeInterval = null;

  async function fadeInMusic() {
    clearInterval(fadeInterval);

    music.volume = 0;

    try {
      await music.play();

      toggle.textContent = "🔊";
      isPlaying = true;

      fadeInterval = setInterval(() => {
        if (music.volume < 0.35) {
          music.volume = Math.min(music.volume + 0.02, 0.35);
        } else {
          clearInterval(fadeInterval);
        }
      }, 80);
    } catch (error) {
      console.log("Music blocked:", error);
    }
  }

  function pauseMusic() {
    clearInterval(fadeInterval);

    music.pause();
    toggle.textContent = "🔈";
    isPlaying = false;
  }

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isPlaying) {
      pauseMusic();
    } else {
      fadeInMusic();
    }
  });

  document.addEventListener(
    "click",
    () => {
      if (!isPlaying) {
        fadeInMusic();
      }
    },
    { once: true },
  );

  document.addEventListener(
    "touchstart",
    () => {
      if (!isPlaying) {
        fadeInMusic();
      }
    },
    { once: true },
  );
}
