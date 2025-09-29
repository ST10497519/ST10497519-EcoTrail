// --- Leaflet base map ---
const map = L.map("map").setView([-33.9249, 18.4241], 12);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap",
}).addTo(map);

const trails = [
  {
    name: "Kloof Corner",
    lat: -33.9566,
    lng: 18.406,
    distanceKm: 1.5,
    challenge: "Easy",
  },
  {
    name: "Boomslang Cave (Kalk Bay)",
    lat: -34.1141,
    lng: 18.4469,
    distanceKm: 3.9,
    challenge: "Medium",
  },
  {
    name: "Cape Point Lighthouse Walk",
    lat: -34.3573,
    lng: 18.4967,
    distanceKm: 2.6,
    challenge: "Easy",
  },
  {
    name: "Lion’s Head Spiral (to Wally’s Cave turn-off)",
    lat: -33.9361,
    lng: 18.3899,
    distanceKm: 4.0,
    challenge: "Medium",
  },

  {
    name: "Pipe Track (segment)",
    lat: -33.9639,
    lng: 18.3877,
    distanceKm: 6.0,
    challenge: "Easy",
  },
  {
    name: "Platteklip Gorge (Table Mountain)",
    lat: -33.959,
    lng: 18.4099,
    distanceKm: 5.5,
    challenge: "Medium",
  },
  {
    name: "India Venster (via Cableway)",
    lat: -33.9628,
    lng: 18.4031,
    distanceKm: 4.7,
    challenge: "Extreme",
  },
  {
    name: "Kasteelspoort (12 Apostles access)",
    lat: -33.9693,
    lng: 18.3817,
    distanceKm: 6.5,
    challenge: "Medium",
  },
  {
    name: "Newlands Forest Contour",
    lat: -33.9708,
    lng: 18.4485,
    distanceKm: 7.0,
    challenge: "Medium",
  },
  {
    name: "Chapman’s Peak Trail",
    lat: -34.0915,
    lng: 18.3567,
    distanceKm: 6.9,
    challenge: "Medium",
  },
  {
    name: "Cecilia Forest Loop",
    lat: -34.0016,
    lng: 18.4206,
    distanceKm: 4.8,
    challenge: "Easy",
  },
  {
    name: "Elephant’s Eye (from Silvermine gate)",
    lat: -34.0907,
    lng: 18.4237,
    distanceKm: 6.3,
    challenge: "Easy",
  },

  {
    name: "Skeleton Gorge → Maclear’s Beacon → Nursery Ravine",
    lat: -33.9881,
    lng: 18.4326,
    distanceKm: 11.5,
    challenge: "Extreme",
  },
  {
    name: "Smuts Track Traverse (Upper Plateau)",
    lat: -33.9727,
    lng: 18.4305,
    distanceKm: 12.0,
    challenge: "Medium",
  },
  {
    name: "12 Apostles Traverse (various links)",
    lat: -33.9788,
    lng: 18.4022,
    distanceKm: 13.0,
    challenge: "Challenging",
  },
  {
    name: "Cape Point Shipwreck Trail (Olifantsbos)",
    lat: -34.2148,
    lng: 18.3792,
    distanceKm: 8.0,
    challenge: "Easy",
  },
  {
    name: "Devil’s Peak via Saddle (round trip)",
    lat: -33.9609,
    lng: 18.4486,
    distanceKm: 7.5,
    challenge: "Extreme",
  },
];

const colors = {
  Easy: "#2e7d32",
  Medium: "#ef6c00",
  Challenging: "#d35400",
  Extreme: "#c62828",
};

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
  const distanceVal = document.getElementById("distanceSelect")?.value || "";
  const challengeVal = document.getElementById("challengeSelect")?.value || "";

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
  ?.addEventListener("change", renderMarkers);
document
  .getElementById("challengeSelect")
  ?.addEventListener("change", renderMarkers);
document.getElementById("clearFilters")?.addEventListener("click", () => {
  const d = document.getElementById("distanceSelect");
  const c = document.getElementById("challengeSelect");
  if (d) d.value = "";
  if (c) c.value = "";
  renderMarkers();
});

const Legend = L.Control.extend({
  options: { position: "bottomright" },
  onAdd: function () {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML = `
      <div class="row"><span class="dot" style="background:${colors.Easy}"></span> Easy</div>
      <div class="row"><span class="dot" style="background:${colors.Medium}"></span> Medium</div>
      <div class="row"><span class="dot" style="background:${colors.Challenging}"></span> Challenging</div>
      <div class="row"><span class="dot" style="background:${colors.Extreme}"></span> Extreme</div>
    `;
    return div;
  },
});
map.addControl(new Legend());

renderMarkers();
