let appState = {
  state: null,
  history: [],
  loading: true,
  error: ""
};

function getLiveSeconds(subjectId) {
  if (!appState.state) return 0;

  const baseSeconds = Number(appState.state[`${subjectId}Seconds`] || 0);

  if (
    appState.state.runningSubject === subjectId &&
    appState.state.lastStart
  ) {
    const startedAt = new Date(appState.state.lastStart).getTime();
    const now = Date.now();

    const elapsed = Math.max(0, Math.floor((now - startedAt) / 1000));

    return baseSeconds + elapsed;
  }

  return baseSeconds;
}

function formatSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
}

function formatShortSeconds(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return `${hours}h ${String(minutes).padStart(2, "0")}m`;
}

async function loadState() {
  try {
    appState.loading = true;
    appState.error = "";
    renderApp();

    const data = await getStateFromApi();

    appState.state = data.state;
    appState.history = data.history || [];
    appState.loading = false;

    renderApp();

  } catch (error) {
    appState.loading = false;
    appState.error = error.message;
    renderApp();
  }
}

async function handleStart(subjectId) {
  try {
    setStatus("Saving timer...");
    const data = await startTimerInApi(subjectId);

    appState.state = data.state;
    appState.history = data.history || [];

    renderApp();

  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handlePause() {
  try {
    setStatus("Saving timer...");
    const data = await pauseTimerInApi();

    appState.state = data.state;
    appState.history = data.history || [];

    renderApp();

  } catch (error) {
    setStatus(error.message, true);
  }
}

async function handleResetSubject(subjectId) {
  const subject = CONFIG.subjects.find(item => item.id === subjectId);

  const confirmed = confirm(`Reset ${subject.name}'s current week timer?`);

  if (!confirmed) return;

  try {
    setStatus("Resetting timer...");
    const data = await resetSubjectInApi(subjectId);

    appState.state = data.state;
    appState.history = data.history || [];

    renderApp();

  } catch (error) {
    setStatus(error.message, true);
  }
}
