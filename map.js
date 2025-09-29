const map = L.map("map").setView([-33.9249, 18.4241], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

const trails = [
  {
    name: "Lion's Head",
    lat: -33.9361,
    lng: 18.3899,
    distanceKm: 5.5,
    challenge: "Medium",
  },
  {
    name: "Platteklip Gorge (Table Mountain)",
    lat: -33.959,
    lng: 18.4099,
    distanceKm: 5.3,
    challenge: "Extreme",
  },
  {
    name: "Kloof Corner",
    lat: -33.9566,
    lng: 18.406,
    distanceKm: 1.5,
    challenge: "Easy",
  },
  {
    name: "Cecilia Forest",
    lat: -34.0016,
    lng: 18.4206,
    distanceKm: 4.8,
    challenge: "Easy",
  },
  {
    name: "Newlands Forest Contour",
    lat: -33.9708,
    lng: 18.4485,
    distanceKm: 7.0,
    challenge: "Medium",
  },
  {
    name: "Chapman's Peak Trail",
    lat: -34.0915,
    lng: 18.3567,
    distanceKm: 6.9,
    challenge: "Medium",
  },
  {
    name: "Pipe Track",
    lat: -33.9639,
    lng: 18.3877,
    distanceKm: 6.0,
    challenge: "Easy",
  },
  {
    name: "Devil's Peak via Saddle",
    lat: -33.9609,
    lng: 18.4486,
    distanceKm: 7.5,
    challenge: "Extreme",
  },
];

const colors = { Easy: "#2e7d32", Medium: "#ef6c00", Extreme: "#c62828" };
const markerLayer = L.layerGroup().addTo(map);

function withinDistanceBucket(distanceKm, bucket) {
  if (!bucket) return true;
  if (bucket === "0-5") return distanceKm <= 5;
  if (bucket === "5-10") return distanceKm > 5 && distanceKm <= 10;
  if (bucket === "10+") return distanceKm > 10;
  return true;
}

function makeMarker(t) {
  return L.circleMarker([t.lat, t.lng], {
    radius: 8,
    color: colors[t.challenge] || "#1976d2",
    fillColor: colors[t.challenge] || "#1976d2",
    fillOpacity: 0.9,
    weight: 2,
  }).bindPopup(
    `<strong>${t.name}</strong><br/>Distance: ${t.distanceKm.toFixed(
      1
    )} km<br/>Challenge: ${t.challenge}`
  );
}

function renderMarkers() {
  const distanceVal = document.getElementById("distanceSelect").value;
  const challengeVal = document.getElementById("challengeSelect").value;

  markerLayer.clearLayers();

  const visible = trails.filter(
    (t) =>
      withinDistanceBucket(t.distanceKm, distanceVal) &&
      (!challengeVal || t.challenge === challengeVal)
  );

  const markers = visible.map((t) => {
    const m = makeMarker(t);
    markerLayer.addLayer(m);
    return m;
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds(), { padding: [30, 30] });
  } else {
    map.setView([-33.9249, 18.4241], 12);
  }
}

document
  .getElementById("distanceSelect")
  .addEventListener("change", renderMarkers);
document
  .getElementById("challengeSelect")
  .addEventListener("change", renderMarkers);
document.getElementById("clearFilters").addEventListener("click", () => {
  document.getElementById("distanceSelect").value = "";
  document.getElementById("challengeSelect").value = "";
  renderMarkers();
});

const Legend = L.Control.extend({
  options: { position: "bottomright" },
  onAdd: function () {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
      <div class="row"><span class="dot" style="background:${colors.Easy}"></span> Easy</div>
      <div class="row"><span class="dot" style="background:${colors.Medium}"></span> Medium</div>
      <div class="row"><span class="dot" style="background:${colors.Extreme}"></span> Extreme</div>
    `;
    return div;
  },
});
map.addControl(new Legend());

renderMarkers();
