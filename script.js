document.addEventListener("DOMContentLoaded", () => {
  const categories = [
    { name: "Web Development", file: "web-dev.json" },
    { name: "Data Science", file: "data-science.json" },
    { name: "App Development", file: "app-dev.json" }
  ];

  const categoriesContainer = document.getElementById("categoriesContainer");

  // === HERO BANNER DYNAMIC ===
let heroData = [];
let currentHero = 0;
let heroInterval;

function loadHeroBanner() {
  fetch("json/hero.json")
    .then(res => res.json())
    .then(data => {
      heroData = data.hero;
      updateHeroBanner();
      heroInterval = setInterval(nextHero, 7000); // auto slide every 7s
    })
    .catch(err => console.error("Error loading hero.json", err));
}

function updateHeroBanner() {
  if (!heroData.length) return;
  const hero = heroData[currentHero];
  const banner = document.getElementById("heroBanner");
  const title = document.getElementById("heroTitle");
  const desc = document.getElementById("heroDesc");

  banner.style.backgroundImage = `url('${hero.image}')`;
  title.textContent = hero.title;
  desc.textContent = hero.description;
}

function nextHero() {
  currentHero = (currentHero + 1) % heroData.length;
  updateHeroBanner();
}

function prevHero() {
  currentHero = (currentHero - 1 + heroData.length) % heroData.length;
  updateHeroBanner();
}

document.getElementById("nextHero").addEventListener("click", () => {
  nextHero();
  resetHeroTimer();
});
document.getElementById("prevHero").addEventListener("click", () => {
  prevHero();
  resetHeroTimer();
});

function resetHeroTimer() {
  clearInterval(heroInterval);
  heroInterval = setInterval(nextHero, 7000);
}

// Pause on hover
const heroBanner = document.getElementById("heroBanner");
heroBanner.addEventListener("mouseenter", () => clearInterval(heroInterval));
heroBanner.addEventListener("mouseleave", () => resetHeroTimer());

// Initialize
loadHeroBanner();


  // Load categories dynamically
  categories.forEach(cat => {
    fetch(`json/${cat.file}`)
      .then(res => res.json())
      .then(data => createCategorySection(data))
      .catch(err => console.log("Error loading", cat.file, err));
  });

  function createCategorySection(data) {
  const section = document.createElement("section");
  section.classList.add("category-section");

  // Section title
  const title = document.createElement("h2");
  title.textContent = data.category;
  section.appendChild(title);

  // Slider container (with arrows)
  const sliderContainer = document.createElement("div");
  sliderContainer.classList.add("slider-container");

  const leftBtn = document.createElement("button");
  leftBtn.classList.add("slide-btn", "left");
  leftBtn.innerHTML = "❮";

  const rightBtn = document.createElement("button");
  rightBtn.classList.add("slide-btn", "right");
  rightBtn.innerHTML = "❯";

  const slider = document.createElement("div");
  slider.classList.add("course-slider");

  // Create course cards
  data.courses.slice(0, 30).forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course-card");

    card.innerHTML = `
      <img src="${course.thumbnail}" alt="${course.title}">
      <div class="course-name">${course.title}</div>
      <div class="course-hover">
        <strong>${course.title}</strong><br>
        ${course.description}
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `course.html?id=${course.id}`;
    });

    slider.appendChild(card);
  });

  // Add elements together
  sliderContainer.appendChild(leftBtn);
  sliderContainer.appendChild(slider);
  sliderContainer.appendChild(rightBtn);
  section.appendChild(sliderContainer);
  categoriesContainer.appendChild(section);

  // Scroll behavior for arrows
  rightBtn.addEventListener("click", () => {
    slider.scrollBy({ left: 400, behavior: "smooth" });
  });
  leftBtn.addEventListener("click", () => {
    slider.scrollBy({ left: -400, behavior: "smooth" });
  });
}


  // 🔍 Search overlay logic
  const searchBtn = document.getElementById("searchBtn");
  const searchOverlay = document.getElementById("searchOverlay");

  searchBtn.addEventListener("click", () => {
    searchOverlay.style.display = "flex";
    document.getElementById("searchInput").focus();
  });

  searchOverlay.addEventListener("click", (e) => {
    if (e.target === searchOverlay) searchOverlay.style.display = "none";
  });
});