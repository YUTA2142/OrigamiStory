const questionSvgInput = document.getElementById("question-svg-input");
const questionSvgPreview = document.getElementById("question-svg-preview");
const answerGridElement = document.getElementById("answer-grid");
const answerJsonInput = document.getElementById("answer-json");
const resetButton = document.getElementById("reset-grid");
const resetQuestionButton = document.getElementById("reset-question");
const registerButton = document.getElementById("register-problem");
const registerStatus = document.getElementById("register-status");
const registerOutput = document.getElementById("register-output");
const registeredList = document.getElementById("registered-list");
const registeredEmpty = document.getElementById("registered-empty");
const registeredCount = document.getElementById("registered-count");

const GRID_SIZE = 4;
const STORAGE_KEY = "origamiStoryProblems";
const STATES = [
  "empty",
  "square",
  "triangle-ne",
  "triangle-nw",
  "triangle-se",
  "triangle-sw"
];

const answerState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);
let currentSvgText = "";

function getStoredProblems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function setStoredProblems(problems) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
}

function formatDate(isoString) {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("ja-JP");
}

function renderGrid(gridElement, stateGrid, options = {}) {
  const { interactive = false, onCellUpdate = null } = options;
  gridElement.innerHTML = "";
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement(interactive ? "button" : "div");
      if (interactive) {
        cell.type = "button";
      }
      cell.className = "cell";
      if (!interactive) {
        cell.classList.add("cell-readonly");
      }
      cell.setAttribute("data-row", row.toString());
      cell.setAttribute("data-col", col.toString());
      cell.setAttribute(
        "aria-label",
        `row ${row + 1} column ${col + 1}`
      );
      updateCellVisual(cell, stateGrid[row][col]);
      if (interactive) {
        cell.addEventListener("click", () =>
          cycleCell(stateGrid, row, col, gridElement, onCellUpdate)
        );
      }
      gridElement.appendChild(cell);
    }
  }
}

function updateCellVisual(cell, state) {
  cell.classList.remove(
    "shape-square",
    "shape-triangle-ne",
    "shape-triangle-nw",
    "shape-triangle-se",
    "shape-triangle-sw"
  );
  if (state === "square") {
    cell.classList.add("shape-square");
  }
  if (state === "triangle-ne") {
    cell.classList.add("shape-triangle-ne");
  }
  if (state === "triangle-nw") {
    cell.classList.add("shape-triangle-nw");
  }
  if (state === "triangle-se") {
    cell.classList.add("shape-triangle-se");
  }
  if (state === "triangle-sw") {
    cell.classList.add("shape-triangle-sw");
  }
}

function cycleCell(stateGrid, row, col, gridElement, onCellUpdate) {
  const currentIndex = STATES.indexOf(stateGrid[row][col]);
  const nextState = STATES[(currentIndex + 1) % STATES.length];
  stateGrid[row][col] = nextState;
  const cell = gridElement.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  if (cell) {
    updateCellVisual(cell, nextState);
  }
  if (onCellUpdate) {
    onCellUpdate();
  }
}

function resetGrid() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      answerState[row][col] = "empty";
    }
  }
  if (answerGridElement) {
    renderGrid(answerGridElement, answerState, {
      interactive: true,
      onCellUpdate: syncAnswerPayload
    });
    syncAnswerPayload();
  }
}

function resetQuestionGrid() {
  currentSvgText = "";
  clearSvgPreview();
  syncAnswerPayload();
}

if (resetButton) {
  resetButton.addEventListener("click", resetGrid);
}
if (resetQuestionButton) {
  resetQuestionButton.addEventListener("click", resetQuestionGrid);
}
if (registerButton) {
  registerButton.addEventListener("click", () => {
    handleRegister();
  });
}

if (answerGridElement) {
  renderGrid(answerGridElement, answerState, {
    interactive: true,
    onCellUpdate: syncAnswerPayload
  });
}

function clearSvgPreview() {
  if (!questionSvgPreview) {
    return;
  }
  questionSvgPreview.innerHTML = "<p>ここに問題SVGが表示されます。</p>";
}

function renderSvgPreview(svgText) {
  if (!questionSvgPreview) {
    return;
  }
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  questionSvgPreview.innerHTML = "";
  if (svgElement) {
    questionSvgPreview.appendChild(svgElement);
  } else {
    questionSvgPreview.innerHTML = "<p>SVGの読み込みに失敗しました。</p>";
  }
}

function createSvgThumbnail(svgText) {
  const wrapper = document.createElement("div");
  wrapper.className = "registered-svg";
  if (!svgText) {
    wrapper.innerHTML = "<p>SVGなし</p>";
    return wrapper;
  }
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  if (svgElement) {
    wrapper.appendChild(svgElement);
  } else {
    wrapper.innerHTML = "<p>SVG読み込み失敗</p>";
  }
  return wrapper;
}

function syncAnswerPayload() {
  if (!answerJsonInput) {
    return;
  }
  const payload = {
    svg: currentSvgText,
    grid: answerState
  };
  answerJsonInput.value = JSON.stringify(payload);
}

function getFilledCellCount() {
  return answerState.reduce(
    (count, row) => count + row.filter((cell) => cell !== "empty").length,
    0
  );
}

function setRegisterStatus(message, type = "info") {
  if (!registerStatus) {
    return;
  }
  registerStatus.textContent = message;
  registerStatus.classList.remove("is-error", "is-success");
  if (type === "error") {
    registerStatus.classList.add("is-error");
  }
  if (type === "success") {
    registerStatus.classList.add("is-success");
  }
}

function updateRegisteredMeta(count) {
  if (registeredCount) {
    registeredCount.textContent = count.toString();
  }
}

function renderRegisteredProblems() {
  if (!registeredList) {
    return;
  }
  const problems = getStoredProblems();
  registeredList.innerHTML = "";
  problems.forEach((problem, index) => {
    const item = document.createElement("article");
    item.className = "registered-item";

    const header = document.createElement("div");
    header.className = "registered-header";
    const title = document.createElement("h3");
    title.textContent = `問題 ${index + 1}`;
    const meta = document.createElement("span");
    meta.className = "registered-date";
    meta.textContent = formatDate(problem.createdAt);
    header.appendChild(title);
    header.appendChild(meta);

    const content = document.createElement("div");
    content.className = "registered-content";
    const svgWrapper = createSvgThumbnail(problem.svg);
    const gridWrapper = document.createElement("div");
    gridWrapper.className = "grid registered-grid";
    renderGrid(gridWrapper, problem.grid, { interactive: false });

    content.appendChild(svgWrapper);
    content.appendChild(gridWrapper);

    const actions = document.createElement("div");
    actions.className = "registered-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "削除";
    deleteButton.addEventListener("click", () => {
      const updatedProblems = getStoredProblems();
      updatedProblems.splice(index, 1);
      setStoredProblems(updatedProblems);
      renderRegisteredProblems();
      setRegisterStatus(`現在の登録数: ${updatedProblems.length}`);
    });
    actions.appendChild(deleteButton);

    item.appendChild(header);
    item.appendChild(content);
    item.appendChild(actions);
    registeredList.appendChild(item);
  });

  if (registeredEmpty) {
    registeredEmpty.style.display = problems.length === 0 ? "block" : "none";
  }
  updateRegisteredMeta(problems.length);
}

function handleRegister() {
  if (!currentSvgText) {
    setRegisterStatus("問題SVGをアップロードしてください。", "error");
    return;
  }
  const filledCellCount = getFilledCellCount();
  if (filledCellCount === 0) {
    setRegisterStatus("答えの図形を1つ以上入力してください。", "error");
    return;
  }
  const problems = getStoredProblems();
  const payload = {
    svg: currentSvgText,
    grid: answerState.map((row) => row.slice()),
    createdAt: new Date().toISOString()
  };
  problems.push(payload);
  setStoredProblems(problems);
  if (registerOutput) {
    registerOutput.textContent = JSON.stringify(payload, null, 2);
    registerOutput.classList.add("is-visible");
  }
  setRegisterStatus(`登録しました。現在の登録数: ${problems.length}`, "success");
  renderRegisteredProblems();
}

if (questionSvgInput) {
  questionSvgInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentSvgText = typeof reader.result === "string" ? reader.result : "";
      renderSvgPreview(currentSvgText);
      syncAnswerPayload();
    };
    reader.readAsText(file);
  });
}

clearSvgPreview();
syncAnswerPayload();
renderRegisteredProblems();
setRegisterStatus(`現在の登録数: ${getStoredProblems().length}`);
