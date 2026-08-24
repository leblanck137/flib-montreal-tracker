/* ============================================================
   FLIB 2.0 ROAD TO MONTRÉAL TRACKER
   ============================================================ */


/* -----------------------------
   TEST WINDOW
------------------------------ */

const startTime =
  new Date(
    "2026-08-21T10:00:00-04:00"
  ).getTime();

const endTime =
  new Date(
    "2026-08-28T16:00:00-04:00"
  ).getTime();


/* -----------------------------
   TEST TOTALS
------------------------------ */

const RUN_HOURS = 174;

const RUN_MILES = 231;

const RUN_CYCLES = 54000;


/*
Prior testing:
309 total projected miles
minus 231 this run
= 78 miles before current run
*/

const STARTING_TOTAL_MILES =
  309 - 231;


/*
72,000 projected total cycles
minus 54,000 this run
= 18,000 prior cycles
*/

const STARTING_TOTAL_CYCLES =
  72000 - 54000;


/* -----------------------------
   REAL WORLD LOCATIONS
------------------------------ */

/*
Approximate Symbotic HQ location
Wilmington, Massachusetts
*/

const WILMINGTON = [
  42.56,
  -71.17
];


/*
Montréal, Québec
*/

const MONTREAL = [
  45.5017,
  -73.5673
];


/* -----------------------------
   HELPERS
------------------------------ */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(
      max,
      value
    )
  );
}


function formatNumber(
  value
) {

  return Math
    .round(value)
    .toLocaleString(
      "en-US"
    );
}


/* ============================================================
   CREATE MAP
   ============================================================ */

const map =
  L.map(
    "map",
    {
      zoomControl: true,

      /*
      Prevent accidental zooming
      while scrolling down the page.
      */

      scrollWheelZoom: false
    }
  );


/* -----------------------------
   BASE MAP
------------------------------ */

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  {
    maxZoom: 19,

    attribution:
      "&copy; OpenStreetMap contributors"
  }

).addTo(map);


/* -----------------------------
   FIT MAP TO BOTH CITIES
------------------------------ */

const mapBounds =
  L.latLngBounds(
    [
      WILMINGTON,
      MONTREAL
    ]
  );


map.fitBounds(
  mapBounds,

  {
    paddingTopLeft:
      [60, 60],

    paddingBottomRight:
      [60, 60]
  }
);


/* -----------------------------
   WILMINGTON MARKER
------------------------------ */

const wilmingtonMarker =
  L.circleMarker(
    WILMINGTON,

    {
      radius: 7,

      color: "#ffffff",

      weight: 3,

      fillColor: "#243750",

      fillOpacity: 1
    }

  ).addTo(map);


wilmingtonMarker.bindTooltip(

  `
  <strong>
    Symbotic HQ
  </strong>
  <br>
  Wilmington, MA
  `,

  {
    permanent: true,
    direction: "bottom",
    offset: [0, 8],
    className: "city-tooltip"
  }
);


/* -----------------------------
   MONTRÉAL MARKER
------------------------------ */

const montrealMarker =
  L.circleMarker(
    MONTREAL,

    {
      radius: 7,

      color: "#ffffff",

      weight: 3,

      fillColor: "#243750",

      fillOpacity: 1
    }

  ).addTo(map);


montrealMarker.bindTooltip(

  `
  <strong>
    Montréal
  </strong>
  <br>
  Québec
  `,

  {
    permanent: true,
    direction: "top",
    offset: [0, -8],
    className: "city-tooltip"
  }
);


/* -----------------------------
   FULL ROUTE
------------------------------ */

const fullRoute =
  L.polyline(
    [
      WILMINGTON,
      MONTREAL
    ],

    {
      color: "#9cadc0",

      weight: 6,

      opacity: 0.85,

      lineCap: "round"
    }

  ).addTo(map);


/* -----------------------------
   COMPLETED ROUTE
------------------------------ */

const progressRoute =
  L.polyline(
    [
      WILMINGTON,
      WILMINGTON
    ],

    {
      color: "#68bd25",

      weight: 7,

      opacity: 1,

      lineCap: "round"
    }

  ).addTo(map);


/* -----------------------------
   FLIB MARKER
------------------------------ */

const liftIcon =
  L.divIcon(
    {
      html:
        `
        <div class="flib-map-marker">
          🏗️
        </div>
        `,

      className: "",

      iconSize:
        [38, 38],

      iconAnchor:
        [19, 19]
    }
  );


const liftMarker =
  L.marker(
    WILMINGTON,

    {
      icon: liftIcon,

      interactive: false,

      zIndexOffset: 1000
    }

  ).addTo(map);


/* ============================================================
   MAP POSITION INTERPOLATION
   ============================================================ */

function interpolatePosition(
  progress
) {

  const latitude =
    WILMINGTON[0] +
    (
      MONTREAL[0] -
      WILMINGTON[0]
    ) *
    progress;


  const longitude =
    WILMINGTON[1] +
    (
      MONTREAL[1] -
      WILMINGTON[1]
    ) *
    progress;


  return [
    latitude,
    longitude
  ];
}


/* ============================================================
   LIVE TRACKER
   ============================================================ */

function updateTracker() {

  const now =
    Date.now();


  /* -----------------------------
     PROGRESS
  ------------------------------ */

  const totalDuration =
    endTime -
    startTime;


  const progress =
    clamp(

      (
        now -
        startTime
      ) /

      totalDuration,

      0,
      1
    );


  const percent =
    progress *
    100;


  /* -----------------------------
     ELAPSED TEST TIME
  ------------------------------ */

  const elapsedHours =
    RUN_HOURS *
    progress;


  /* -----------------------------
     MILEAGE
  ------------------------------ */

  const currentMiles =
    RUN_MILES *
    progress;


  const totalMiles =
    STARTING_TOTAL_MILES +
    currentMiles;


  /* -----------------------------
     CYCLES
  ------------------------------ */

  const currentCycles =
    RUN_CYCLES *
    progress;


  const totalCycles =
    STARTING_TOTAL_CYCLES +
    currentCycles;


  /* -----------------------------
     UPDATE NUMBERS
  ------------------------------ */

  document
    .getElementById(
      "meterFill"
    )
    .style
    .width =
      percent +
      "%";


  document
    .getElementById(
      "progressBadge"
    )
    .textContent =
      percent.toFixed(1) +
      "% complete";


  document
    .getElementById(
      "elapsedHours"
    )
    .textContent =
      elapsedHours.toFixed(1) +
      " hr";


  document
    .getElementById(
      "runMiles"
    )
    .textContent =
      currentMiles.toFixed(1) +
      " mi";


  document
    .getElementById(
      "runCycles"
    )
    .textContent =
      formatNumber(
        currentCycles
      );


  document
    .getElementById(
      "totalMiles"
    )
    .textContent =
      totalMiles.toFixed(1) +
      " mi";


  document
    .getElementById(
      "totalCycles"
    )
    .textContent =
      formatNumber(
        totalCycles
      );


  /* -----------------------------
     UPDATE MAP POSITION
  ------------------------------ */

  const currentPosition =
    interpolatePosition(
      progress
    );


  liftMarker.setLatLng(
    currentPosition
  );


  progressRoute.setLatLngs(
    [
      WILMINGTON,
      currentPosition
    ]
  );


  /* -----------------------------
     COUNTDOWN
  ------------------------------ */

  const secondsRemaining =
    Math.max(
      0,

      Math.floor(
        (
          endTime -
          now
        ) /
        1000
      )
    );


  const days =
    Math.floor(
      secondsRemaining /
      86400
    );


  const hours =
    Math.floor(

      (
        secondsRemaining %
        86400
      ) /

      3600
    );


  const minutes =
    Math.floor(

      (
        secondsRemaining %
        3600
      ) /

      60
    );


  const seconds =
    secondsRemaining %
    60;


  const countdown =
    document.getElementById(
      "countdown"
    );


  const status =
    document.getElementById(
      "statusText"
    );


  /* -----------------------------
     STATUS LOGIC
  ------------------------------ */

  if (
    now <
    startTime
  ) {

    countdown.textContent =
      "Not started";

    status.textContent =
      "Waiting at HQ";
  }


  else if (
    now >=
    endTime
  ) {

    countdown.textContent =
      "ARRIVED 🇨🇦";

    status.textContent =
      "Montréal achieved";
  }


  else {

    let countdownText =
      "";


    if (
      days >
      0
    ) {

      countdownText +=
        days +
        "d ";
    }


    countdownText +=
      String(hours)
        .padStart(
          2,
          "0"
        ) +

      "h " +

      String(minutes)
        .padStart(
          2,
          "0"
        ) +

      "m " +

      String(seconds)
        .padStart(
          2,
          "0"
        ) +

      "s";


    countdown.textContent =
      countdownText;


    status.textContent =
      "Northbound 🇨🇦";
  }
}


/* ============================================================
   START TRACKER
   ============================================================ */

updateTracker();


setInterval(
  updateTracker,
  1000
);
