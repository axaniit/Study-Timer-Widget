async function callApi(action, params = {}) {
  const query = new URLSearchParams({
    action,
    ...params
  });

  const url = `${CONFIG.apiUrl}?${query.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not connect to the timer database.");
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "The timer database returned an error.");
  }

  return data;
}

async function getStateFromApi() {
  return await callApi("getState");
}

async function startTimerInApi(subjectId) {
  return await callApi("start", {
    subject: subjectId
  });
}

async function pauseTimerInApi() {
  return await callApi("pause");
}

async function resetSubjectInApi(subjectId) {
  return await callApi("resetSubject", {
    subject: subjectId
  });
}
