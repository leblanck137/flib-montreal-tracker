const startTime = new Date("2026-08-21T10:00:00-04:00").getTime();
const endTime   = new Date("2026-08-28T16:00:00-04:00").getTime();

/*
Authoritative planned endpoints from the lifecycle-testing summary:
- 174 hr continuous run
- 231 miles during this run
- ~54,000 cycles during this run
- ~309 total lifecycle miles
- ~72,000 total lifecycle cycles

Using endpoints instead of a calculated cycle-rate keeps the tracker aligned
with the values you plan to report internally.
*/

const RUN_HOURS = 174;
const RUN_MILES = 231;
const RUN_CYCLES = 54000;

const STARTING_TOTAL_MILES = 309 - 231;      // 78
const STARTING_TOTAL_CYCLES = 72000 - 54000; // 18,000

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function formatNumber(value) {
  return Math.round(value).toLocaleString("en-US");
}

function updateTracker() {
  const now = Date.now();

  const totalDuration = endTime - startTime;
  const rawProgress = (now - startTime) / totalDuration;
  const progress = clamp(rawProgress, 0, 1);

  const elapsedHours = RUN_HOURS * progress;
  const currentMiles = RUN_MILES * progress;
  const currentCycles = RUN_CYCLES * progress;

  const totalMiles = STARTING_TOTAL_MILES + currentMiles;
  const totalCycles = STARTING_TOTAL_CYCLES + currentCycles;

  const percent = progress * 100;

  document.getElementById("trackProgress").style.width = percent + "%";
  document.getElementById("meterFill").style.width = percent + "%";
  document.getElementById("progressBadge").textContent =
    percent.toFixed(1) + "% complete";

  document.getElementById("elapsedHours").textContent =
    elapsedHours.toFixed(1) + " hr";

  document.getElementById("runMiles").textContent =
    currentMiles.toFixed(1) + " mi";

  document.getElementById("runCycles").textContent =
    formatNumber(currentCycles);

  document.getElementById("totalMiles").textContent =
    totalMiles.toFixed(1) + " mi";

  document.getElementById("totalCycles").textContent =
    formatNumber(totalCycles);

  // Move icon along the same approximate diagonal as the route.
  const markerLeft = 10 + 80 * progress;
  const markerTop = 58 - 25 * progress;

  const liftMarker = document.getElementById("liftMarker");
  liftMarker.style.left = markerLeft + "%";
  liftMarker.style.top = markerTop + "%";

  const secondsRemaining = Math.max(0, Math.floor((endTime - now) / 1000));

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const countdown = document.getElementById("countdown");
  const status = document.getElementById("statusText");

  if (now < startTime) {
    countdown.textContent = "Not started";
    status.textContent = "Waiting at HQ";
  } else if (now >= endTime) {
    countdown.textContent = "ARRIVED 🇨🇦";
    status.textContent = "Montréal achieved";
  } else {
    let countdownText = "";

    if (days > 0) {
      countdownText += days + "d ";
    }

    countdownText +=
      String(hours).padStart(2, "0") + "h " +
      String(minutes).padStart(2, "0") + "m " +
      String(seconds).padStart(2, "0") + "s";

    countdown.textContent = countdownText;
    status.textContent = "Still trucking";
  }
}

updateTracker();
setInterval(updateTracker, 1000);
