// scripts.js
// Odliczanie do 26 października 2025 + lightbox + animacje + trwałe odblokowanie linku

// ---------------------------------------------
// KONFETTI — EMOJI SPADAJĄCE (używane tylko przy odblokowaniu)
// ---------------------------------------------
function startConfetti() {
  const emojis = ["💖", "🎂", "🎉", "🌸", "💫", "✨"];
  const confettiCount = 60;

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    document.body.appendChild(confetti);

    const startLeft = Math.random() * 100;
    const duration = 4 + Math.random() * 4;
    const size = 18 + Math.random() * 26;

    confetti.style.left = `${startLeft}vw`;
    confetti.style.fontSize = `${size}px`;
    confetti.style.animation = `fall ${duration}s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 1.5}s`;

    // usuń po animacji
    setTimeout(() => confetti.remove(), (duration + 1.5) * 1000);
  }
}

// ---------------------------------------------
// LICZNIK I TRWAŁY LINK
// ---------------------------------------------
function initCountdown() {
  const countdownContainer = document.querySelector('.countdown');
  if (!countdownContainer) return;

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Jeśli link już istnieje w DOM — nie tworzymy kolejnego
  let nextLink = document.getElementById("nextLink");
  if (!nextLink) {
    const linkContainer = document.createElement("div");
    linkContainer.className = "next-link-container";
    linkContainer.innerHTML = `
      <a id="nextLink" href="next.html" class="next-link disabled" aria-disabled="true">
        🎁 Otwórz mnie 🎁
      </a>
    `;
    document.body.appendChild(linkContainer);
    nextLink = document.getElementById("nextLink");
  }

  // Helper: odblokuj link wizualnie
  function unlockNextLink() {
    if (!nextLink) return;
    nextLink.classList.remove("disabled");
    nextLink.removeAttribute("aria-disabled");
    nextLink.classList.add("unlocked");
  }

  // Kliknięcie dla zablokowanego linku
  nextLink.addEventListener("click", (e) => {
    if (nextLink.classList.contains("disabled")) {
      e.preventDefault();
      nextLink.addEventListener("click", (e) => {
  if (nextLink.classList.contains("disabled")) {
    e.preventDefault();
    showCutePopup("Jeszcze nie czas 💫");
  }
});

    }
  });

  // docelowa chwila (lokalny czas): 26 października 2025 00:00:00
  const target = new Date(2025, 9, 26, 0, 0,0).getTime();

  // Sprawdź czy wcześniej już odblokowano (np. po faktycznym nadejściu daty)
  const alreadyUnlocked = localStorage.getItem("nextUnlocked") === "true";
  if (alreadyUnlocked) {
    // odblokuj przycisk (ale NIE przerywamy odliczania — pokażemy czas do daty, chyba że data już minęła)
    unlockNextLink();
  }

  // Główna funkcja aktualizująca licznik
  function updateCountdown() {
    const now = Date.now();
    const diff = target - now;

    // Jeśli data minęła — pokaż 00 i odblokuj (jeśli jeszcze nie odblokowane)
    if (diff <= 0) {
      // zatrzymaj aktualizacje (ustawienie zera)
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';

      // jeśli nie było zapisane w localStorage, odblokuj, zapisz i uruchom konfetti
      if (localStorage.getItem("nextUnlocked") !== "true") {
        unlockNextLink();
        localStorage.setItem("nextUnlocked", "true");
        // konfetti uruchamiamy raz (tylko wtedy, gdy rzeczywiście to pierwszy raz)
        startConfetti();
      }
      // już nic więcej do liczenia — zwracamy
      return;
    }

    // Normalne odliczanie (wyświetlamy wartości)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  // start
  updateCountdown();
  const intervalId = setInterval(updateCountdown, 1000);
}

// ---------------------------------------------
// Lightbox Gallery
// ---------------------------------------------
function initLightbox() {
  const figures = document.querySelectorAll('.gallery-grid figure');
  if (!figures.length) return;

  // jeśli lightbox już istnieje (np. przy HMR) - nie twórz ponownie
  if (document.querySelector('.lightbox')) return;

  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  lightbox.setAttribute('aria-hidden', 'true');

  lightbox.innerHTML = `
  <div class="lightbox-inner">
    <button class="lightbox-close" aria-label="Zamknij">×</button>
    <img src="" alt="" />
    <div class="lightbox-caption"></div>
  </div>
`;


  document.body.appendChild(lightbox);

  const imgEl = lightbox.querySelector('img');
  const captionEl = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  function openLightbox(src, caption) {
    imgEl.src = src;
    captionEl.textContent = caption || '';
    lightbox.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    imgEl.src = '';
  }

  figures.forEach(fig => {
    const img = fig.querySelector('img');
    const caption = fig.querySelector('figcaption')?.textContent;
    if (!img) return;
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(img.src, caption));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

// ---------------------------------------------
// Scroll Animations
// ---------------------------------------------
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    observer.observe(section);
  });
}

// ---------------------------------------------
// Init everything
// ---------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initLightbox();
  initScrollAnimations();
});
// ---------------------------------------------
// Cute Popup 💖
// ---------------------------------------------
function showCutePopup(message) {
  // usuń poprzedni jeśli był
  const existing = document.querySelector(".cute-popup");
  if (existing) existing.remove();

  // stwórz nowy popup
  const popup = document.createElement("div");
  popup.className = "cute-popup";
  popup.innerHTML = `
    <div class="cute-popup-inner">
      <div class="popup-emoji">🎀</div>
      <p>${message}</p>
      <button class="popup-close">💞 Zamknij</button>
    </div>
  `;
  document.body.appendChild(popup);

  // animacja wejścia
  setTimeout(() => popup.classList.add("show"), 50);

  // zamykanie
  popup.querySelector(".popup-close").addEventListener("click", () => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  });
}
function checkGuess() {
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > 100) {
    message.textContent = "Podaj liczbę z zakresu 1–100!";
    message.className = "";
    return;
  }

  attempts++;
  attemptsCount.textContent = attempts;

  // Co ile prób pokazywać podpowiedź
  const hintInterval = 3; // np. co 3 próby
  let hintText = "";

  if (attempts % hintInterval === 0) {
    hintText = " 🤔 " + getHint(secretNumber);
  }

  if (guess < secretNumber) {
    message.textContent = "Za mała liczba!" + hintText;
    message.className = "message-small";
  } else if (guess > secretNumber) {
    message.textContent = "Za duża liczba!" + hintText;
    message.className = "message-large";
  } else {
    message.textContent = `🎉 Brawo! Trafiłeś liczbę ${secretNumber} w ${attempts} próbach!`;
    message.className = "message-correct";
    guessInput.disabled = true;
    tryButton.disabled = true;
  }

  guessInput.value = "";
  guessInput.focus();
}

function openSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.classList.add('active');
  }
}

function closeSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.classList.remove('active');
  }
}



