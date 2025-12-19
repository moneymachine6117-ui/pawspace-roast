console.log("app.js loaded");

async function loadFeed() {
  const res = await fetch("/api/feed");
  const posts = await res.json();
  const feed = document.getElementById("feed");
  if (!feed) return;

  posts.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}">
      <div class="content">
        <strong>@${p.petName}</strong>
        <p>${p.roast}</p>
        <div class="actions">
          ❤️ ${p.likes}
          <a href="profile.html?pet=${p.petName}">Profile</a>
        </div>
      </div>
    `;
    feed.appendChild(card);
  });
}

async function loadProfile() {
  const params = new URLSearchParams(location.search);
  const pet = params.get("pet");
  if (!pet) return;

  document.getElementById("petName").textContent = pet;

  const res = await fetch("/api/feed");
  const posts = await res.json();
  const container = document.getElementById("profilePosts");

  posts
    .filter(p => p.petName === pet)
    .forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${p.image}">
        <div class="content">${p.roast}</div>
      `;
      container.appendChild(card);
    });
}

loadFeed();
loadProfile();
