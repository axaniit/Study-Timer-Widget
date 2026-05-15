function renderApp() {
  renderStatus();
  renderTimers();
  renderWeeklyLog();
}

function renderStatus() {
  const status = document.getElementById("statusMessage");

  if (appState.loading) {
    status.textContent = "Loading timers...";
    status.classList.remove("error");
    return;
  }

  if (appState.error) {
    status.textContent = appState.error;
    status.classList.add("error");
    return;
  }

  status.textContent = appState.state?.runningSubject
    ? `${getSubjectName(appState.state.runningSubject)} is currently running.`
    : "No timer is currently running.";

  status.classList.remove("error");
}

function renderTimers() {
  const grid = document.getElementById("timerGrid");

  if (!appState.state) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = CONFIG.subjects.map(subject => {
    const seconds = getLiveSeconds(subject.id);
    const goalSeconds = subject.goalHours * 3600;
    const progress = Math.min(seconds / goalSeconds, 1);
    const percent = Math.round(progress * 100);

    const radius = 82;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - progress * circumference;

    const isRunning = appState.state.runningSubject === subject.id;

    return `
      <article class="timer-card">
        <h2 class="subject-title">${subject.name}</h2>

        <div class="circle-wrap">
          <svg class="progress-ring" width="210" height="210">
            <circle
              class="progress-bg"
              cx="105"
              cy="105"
              r="${radius}">
            </circle>

            <circle
              class="progress-fill"
              cx="105"
              cy="105"
              r="${radius}"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${offset}">
            </circle>
          </svg>

          <div class="circle-center">
            <div class="percent">${percent}%</div>
            <div class="percent-label">of weekly goal</div>
          </div>
        </div>

        <p class="goal-line">Goal: ${subject.goalHours} hours, Monday to Sunday</p>
        <p class="time-readout">${formatSeconds(seconds)}</p>

        <div class="controls">
          <button
            class="control-button start-button"
            onclick="handleStart('${subject.id}')">
            ${isRunning ? "Running" : "Start"}
          </button>

          <button
            class="control-button pause-button"
            onclick="handlePause()">
            Pause
          </button>

          <button
            class="control-button reset-button"
            onclick="handleResetSubject('${subject.id}')">
            Reset
          </button>
        </div>

        ${isRunning ? `<div class="running-note">Timer is active.</div>` : ""}
      </article>
    `;
  }).join("");
}

function renderWeeklyLog() {
  const weeklyList = document.getElementById("weeklyList");

  if (!appState.state) {
    weeklyList.innerHTML = `<div class="empty">Loading weekly log...</div>`;
    return;
  }

  const currentWeek = `
    <div class="week-row">
      <div class="week-title">Current Week: ${appState.state.currentWeek}</div>
      <div class="week-subjects">
        ${CONFIG.subjects.map(subject => `
          <div>${subject.name}: ${formatShortSeconds(getLiveSeconds(subject.id))}</div>
        `).join("")}
      </div>
    </div>
  `;

  const previousWeeks = appState.history.length
    ? appState.history.map(week => `
      <div class="week-row">
        <div class="week-title">Week of ${week.week}</div>
        <div class="week-subjects">
          <div>Orgo: ${formatShortSeconds(Number(week.orgoSeconds || 0))}</div>
          <div>Micro: ${formatShortSeconds(Number(week.microSeconds || 0))}</div>
        </div>
      </div>
    `).join("")
    : `<div class="empty">No previous weeks logged yet.</div>`;

  weeklyList.innerHTML = currentWeek + previousWeeks;
}

function getSubjectName(subjectId) {
  const subject = CONFIG.subjects.find(item => item.id === subjectId);
  return subject ? subject.name : subjectId;
}

function setStatus(message, isError = false) {
  const status = document.getElementById("statusMessage");

  status.textContent = message;

  if (isError) {
    status.classList.add("error");
  } else {
    status.classList.remove("error");
  }
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  const panels = document.querySelectorAll(".tab-panel");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const tabId = button.dataset.tab;

      buttons.forEach(item => item.classList.remove("active"));
      panels.forEach(panel => panel.classList.remove("active"));

      button.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });
}

function setupThemeToggle() {
  const button = document.getElementById("themeToggle");

  const savedTheme = localStorage.getItem("studyTimerTheme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    button.textContent = "Light Mode";
  } else {
    document.body.classList.remove("dark");
    button.textContent = "Dark Mode";
  }

  button.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");

    localStorage.setItem("studyTimerTheme", isDark ? "dark" : "light");

    button.textContent = isDark ? "Light Mode" : "Dark Mode";
  });
}

setupThemeToggle();
setupTabs();
loadState();

setInterval(() => {
  if (appState.state) {
    renderApp();
  }
}, 1000);

setInterval(() => {
  refreshStateSilently();
}, 300000);
