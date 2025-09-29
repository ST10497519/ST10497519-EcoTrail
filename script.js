// Pane elements
const trailPane = document.getElementById("trail-pane");
const paneHeader = document.getElementById("pane-header");
const paneTitle = paneHeader.querySelector("h2");
const paneLink = document.querySelector(".expand-pane-link");

paneHeader.addEventListener("click", (e) => {

  if (window.innerWidth > 768) {
    e.preventDefault();
    trailPane.classList.toggle("open");

    // Change arrow ▼ / ▲
    if (trailPane.classList.contains("open")) {
      paneTitle.textContent = "Explore Hiking Trails ▲";
    } else {
      paneTitle.textContent = "Explore Hiking Trails ▼";
    }
  }
});

// Navigate directly to map page when pane is clicked
if (window.innerWidth <= 768) {
  trailPane.addEventListener("click", () => {
    window.location.href = "trail-map.html";
  });
}
