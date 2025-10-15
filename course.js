document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("id");

  const res = await fetch("json/web-dev.json");
  const data = await res.json();
  const course = data.courses.find(c => c.id === courseId);
  if (!course) return alert("Course not found!");

  const title = document.getElementById("courseTitle");
  const playerContainer = document.getElementById("playerContainer");
  const video = document.getElementById("videoPlayer");
  const videoSource = document.getElementById("videoSource");

  title.textContent = course.title;

  // 🎬 Add iframe for Streamtape
  const iframe = document.createElement("iframe");
  iframe.id = "iframePlayer";
  iframe.allowFullscreen = true;
  iframe.frameBorder = "0";
  iframe.width = "100%";
  iframe.height = "500px";
  iframe.style.display = "none";
  playerContainer.appendChild(iframe);

  // ✅ Play video (Streamtape or MP4)
  function playVideo(url, clickedEl) {
    if (!url) return;

    // remove highlight from previous
    document.querySelectorAll(".lecture.active").forEach(el => el.classList.remove("active"));
    if (clickedEl) clickedEl.classList.add("active");

    if (url.includes("streamtape.com")) {
      video.style.display = "none";
      iframe.style.display = "block";
      iframe.src = url.replace("/v/", "/e/");
    } else {
      iframe.style.display = "none";
      video.style.display = "block";
      videoSource.src = url;
      video.load();
      video.play();
    }

    // save progress
    localStorage.setItem(`progress_${course.id}`, JSON.stringify({ videoUrl: url }));
  }

  // Load saved or first video
  const savedProgress = JSON.parse(localStorage.getItem(`progress_${course.id}`));
  const firstVideo =
    savedProgress?.videoUrl || course.days[0]?.lectures?.[0]?.videoUrl || "";
  playVideo(firstVideo);

  // 🧭 Watch Mode
  const watchBtn = document.getElementById("watchModeBtn");
  watchBtn.addEventListener("click", () => {
    document.body.classList.toggle("watch-mode-active");
    localStorage.setItem(
      "watchMode",
      document.body.classList.contains("watch-mode-active")
    );
  });
  if (localStorage.getItem("watchMode") === "true") {
    document.body.classList.add("watch-mode-active");
  }

  // 🗓️ Render Days & Lectures
  const daysContainer = document.getElementById("daysContainer");
  daysContainer.innerHTML = "";

  course.days.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.classList.add("day");

    const header = document.createElement("div");
    header.classList.add("day-header");
    header.textContent = day.day;
    dayDiv.appendChild(header);

    const lecturesDiv = document.createElement("div");
    lecturesDiv.classList.add("lectures");

    day.lectures.forEach((lec, index) => {
      const lecDiv = document.createElement("div");
      lecDiv.classList.add("lecture");
      lecDiv.innerHTML = `
        <div class="lecture-number">${index + 1}.</div>
        <img src="${course.thumbnail}" alt="thumb">
        <div class="lecture-details">
          <span class="lecture-title">${lec.title}</span>
          <span class="lecture-duration">${lec.duration}</span>
        </div>
      `;

      lecDiv.addEventListener("click", () => {
        playVideo(lec.videoUrl, lecDiv);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      lecturesDiv.appendChild(lecDiv);
    });

    header.addEventListener("click", () => {
      lecturesDiv.classList.toggle("open");
    });

    dayDiv.appendChild(lecturesDiv);
    daysContainer.appendChild(dayDiv);
  });

  // 💡 Suggested Courses
  const suggested = data.courses.filter(c => c.id !== course.id).slice(0, 6);
  const suggestedContainer = document.getElementById("suggestedCourses");
  suggestedContainer.innerHTML = "";
  suggested.forEach(c => {
    const card = document.createElement("div");
    card.classList.add("suggested-card");
    card.innerHTML = `
      <img src="${c.thumbnail}" alt="${c.title}">
      <h4>${c.title}</h4>
    `;
    card.addEventListener("click", () => {
      window.location.href = `course.html?id=${c.id}`;
    });
    suggestedContainer.appendChild(card);
  });
});