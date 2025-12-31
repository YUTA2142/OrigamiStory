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
const storyInput = document.getElementById("story-input");
const solveProblemSelect = document.getElementById("solve-problem-select");
const solveSvgPreview = document.getElementById("solve-svg-preview");
const solveGridElement = document.getElementById("solve-grid");
const solveResetButton = document.getElementById("solve-reset-grid");
const solveSubmitButton = document.getElementById("submit-answer");
const solveResult = document.getElementById("solve-result");
const solveStory = document.getElementById("solve-story");
const solveMeta = document.getElementById("solve-meta");
const storyTitle = document.getElementById("story-title");
const storyBackButton = document.getElementById("story-back");
const storyReveal = document.querySelector(".story-reveal");
const viewButtons = document.querySelectorAll("[data-view-button]");
const viewSections = document.querySelectorAll("section[data-view]");
const adminGate = document.getElementById("admin-gate");
const adminPasswordInput = document.getElementById("admin-password-input");
const adminPasswordSubmit = document.getElementById("admin-password-submit");
const adminPasswordCancel = document.getElementById("admin-password-cancel");
const adminGateStatus = document.getElementById("admin-gate-status");

const GRID_SIZE = 4;
const STORAGE_KEY = "origamiStoryProblems";
const PROBLEMS_JSON_URL = "./problems.json";
const ADMIN_PASSWORD = "origami-admin";
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
const solveState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);
let currentSvgText = "";
let currentSolveIndex = null;
let currentSolveProblem = null;
let storyRevealTimeoutId = null;
let adminAccessGranted = false;
let initialProblems = [];

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

function getAllProblems() {
  return [...initialProblems, ...getStoredProblems()];
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

function resetSolveGrid() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      solveState[row][col] = "empty";
    }
  }
  if (solveGridElement) {
    renderGrid(solveGridElement, solveState, {
      interactive: true,
      onCellUpdate: () => {
        setSolveStatus("回答を入力して提出してください。");
      }
    });
  }
}

function resetQuestionGrid() {
  currentSvgText = "";
  clearSvgPreview(questionSvgPreview, "ここに問題SVGが表示されます。");
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
if (solveResetButton) {
  solveResetButton.addEventListener("click", resetSolveGrid);
}
if (solveSubmitButton) {
  solveSubmitButton.addEventListener("click", () => {
    handleSolveSubmit();
  });
}
if (solveProblemSelect) {
  solveProblemSelect.addEventListener("change", () => {
    loadSelectedProblem();
  });
}
if (storyBackButton) {
  storyBackButton.addEventListener("click", () => {
    setView("solve");
  });
}
if (adminPasswordSubmit) {
  adminPasswordSubmit.addEventListener("click", () => {
    handleAdminAccess();
  });
}
if (adminPasswordCancel) {
  adminPasswordCancel.addEventListener("click", () => {
    closeAdminGate();
  });
}
if (adminPasswordInput) {
  adminPasswordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAdminAccess();
    }
  });
}
  });
}
if (viewButtons.length) {
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.getAttribute("data-view-button");
      if (targetView) {
        if (targetView === "register" && !adminAccessGranted) {
          openAdminGate();
          return;
        }
        setView(targetView);
      }
    });
  });
}

if (answerGridElement) {
  renderGrid(answerGridElement, answerState, {
    interactive: true,
    onCellUpdate: syncAnswerPayload
  });
}

function clearSvgPreview(targetElement, placeholderText) {
  if (!targetElement) {
    return;
  }
  targetElement.innerHTML = `<p>${placeholderText}</p>`;
}

function renderSvgPreview(svgText, targetElement, placeholderText) {
  if (!targetElement) {
    return;
  }
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  targetElement.innerHTML = "";
  if (svgElement) {
    targetElement.appendChild(svgElement);
  } else {
    clearSvgPreview(targetElement, placeholderText);
  }
}

function createSvgThumbnail(svgText) {
  const wrapper = document.createElement("div");
  wrapper.className = "registered-svg";
  if (!svgText) {
    wrapper.innerHTML = "<p>SVGなし</p>";
    return wrapper;
  }
  const img = document.createElement("img");
  img.alt = "登録済みの問題SVG";
  img.loading = "lazy";
  img.decoding = "async";
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
  wrapper.appendChild(img);
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

function updateProblemsExport() {
  if (!registerOutput) {
    return;
  }
  const payload = JSON.stringify(getAllProblems(), null, 2);
  registerOutput.textContent = payload;
  registerOutput.classList.toggle("is-visible", payload.length > 0);
}

function setSolveStatus(message, type = "info") {
  if (!solveResult) {
    return;
  }
  solveResult.textContent = message;
  solveResult.classList.remove("is-error", "is-success");
  if (type === "error") {
    solveResult.classList.add("is-error");
  }
  if (type === "success") {
    solveResult.classList.add("is-success");
  }
}

function setSolveMeta(message) {
  if (solveMeta) {
    solveMeta.textContent = message;
  }
}

function setAdminGateStatus(message, type = "info") {
  if (!adminGateStatus) {
    return;
  }
  adminGateStatus.textContent = message;
  adminGateStatus.classList.remove("is-error", "is-success");
  if (type === "error") {
    adminGateStatus.classList.add("is-error");
  }
  if (type === "success") {
    adminGateStatus.classList.add("is-success");
  }
}

function openAdminGate() {
  if (!adminGate) {
    return;
  }
  adminGate.hidden = false;
  setAdminGateStatus("");
  if (adminPasswordInput) {
    adminPasswordInput.value = "";
    adminPasswordInput.focus();
  }
}

function closeAdminGate() {
  if (!adminGate) {
    return;
  }
  adminGate.hidden = true;
  setAdminGateStatus("");
}

function handleAdminAccess() {
  const password = adminPasswordInput ? adminPasswordInput.value : "";
  if (password !== ADMIN_PASSWORD) {
    setAdminGateStatus("パスワードが違います。", "error");
    if (adminPasswordInput) {
      adminPasswordInput.focus();
    }
    return;
  }
  adminAccessGranted = true;
  setAdminGateStatus("管理者として認証しました。", "success");
  closeAdminGate();
  setView("register");
}

function setStoryTitle(index = null) {
  if (!storyTitle) {
    return;
  }
  if (index === null) {
    storyTitle.textContent = "宇宙の記憶";
    return;
  }
  storyTitle.textContent = `宇宙の記憶 No.${index}`;
}

function setSolveStory(message = "", visible = false) {
  if (!solveStory) {
    return;
  }
  if (!visible) {
    solveStory.hidden = true;
    solveStory.textContent = "";
    return;
  }
  solveStory.hidden = false;
  solveStory.textContent = message;
}

function triggerStoryReveal() {
  if (!storyReveal) {
    return;
  }
  document.body.classList.remove("is-story-transition");
  void document.body.offsetWidth;
  document.body.classList.add("is-story-transition");
  if (storyRevealTimeoutId) {
    window.clearTimeout(storyRevealTimeoutId);
  }
  storyRevealTimeoutId = window.setTimeout(() => {
    document.body.classList.remove("is-story-transition");
  }, 2200);
}

function updateRegisteredMeta(count) {
  if (registeredCount) {
    registeredCount.textContent = count.toString();
  }
}

function renderSolveOptions(problems = getAllProblems()) {
  if (!solveProblemSelect) {
    return;
  }
  solveProblemSelect.innerHTML = "";
  if (problems.length === 0) {
    const option = document.createElement("option");
    option.textContent = "登録された問題がありません";
    option.value = "";
    option.disabled = true;
    option.selected = true;
    solveProblemSelect.appendChild(option);
    solveProblemSelect.disabled = true;
    currentSolveIndex = null;
    currentSolveProblem = null;
    resetSolveGrid();
    clearSvgPreview(
      solveSvgPreview,
      "ここに選択した問題SVGが表示されます。"
    );
    setSolveMeta("登録された問題がありません。");
    setSolveStatus("問題を登録するとここで解答できます。");
    setSolveStory();
    return;
  }
  solveProblemSelect.disabled = false;
  problems.forEach((problem, index) => {
    const option = document.createElement("option");
    option.value = index.toString();
    option.textContent = `問題 ${index + 1}`;
    solveProblemSelect.appendChild(option);
  });
  if (currentSolveIndex !== null && currentSolveIndex < problems.length) {
    solveProblemSelect.value = currentSolveIndex.toString();
  } else {
    solveProblemSelect.value = "0";
  }
  setSolveMeta(`登録数: ${problems.length}`);
  loadSelectedProblem(problems);
}

function loadSelectedProblem(problems = getAllProblems()) {
  if (!solveProblemSelect || solveProblemSelect.disabled) {
    return;
  }
  const index = Number.parseInt(solveProblemSelect.value, 10);
  if (Number.isNaN(index) || !problems[index]) {
    currentSolveIndex = null;
    currentSolveProblem = null;
    resetSolveGrid();
    clearSvgPreview(
      solveSvgPreview,
      "ここに選択した問題SVGが表示されます。"
    );
    setSolveStatus("問題を選択してください。");
    setSolveStory();
    return;
  }
  currentSolveIndex = index;
  currentSolveProblem = problems[index];
  renderSvgPreview(
    currentSolveProblem.svg,
    solveSvgPreview,
    "ここに選択した問題SVGが表示されます。"
  );
  resetSolveGrid();
  setSolveStatus("回答を入力して提出してください。");
  setSolveStory();
}

function getShapeType(state) {
  if (state === "square") {
    return "square";
  }
  if (state.startsWith("triangle")) {
    return "triangle";
  }
  return "empty";
}

function getShapeCounts(grid) {
  const counts = {
    square: 0,
    triangle: 0
  };
  if (!Array.isArray(grid) || grid.length !== GRID_SIZE) {
    return counts;
  }
  for (let row = 0; row < GRID_SIZE; row += 1) {
    if (!Array.isArray(grid[row]) || grid[row].length !== GRID_SIZE) {
      continue;
    }
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const shapeType = getShapeType(grid[row][col]);
      if (shapeType === "square") {
        counts.square += 1;
      }
      if (shapeType === "triangle") {
        counts.triangle += 1;
      }
    }
  }
  return counts;
}

function isShapeCountMatch(answerGrid, solutionGrid) {
  const answerCounts = getShapeCounts(answerGrid);
  const solutionCounts = getShapeCounts(solutionGrid);
  return (
    answerCounts.square === solutionCounts.square &&
    answerCounts.triangle === solutionCounts.triangle
  );
}

function handleSolveSubmit() {
  if (!currentSolveProblem) {
    setSolveStatus("解く問題を選択してください。", "error");
    setSolveStory();
    return;
  }
  const isCorrect = isShapeCountMatch(solveState, currentSolveProblem.grid);
  if (isCorrect) {
    setSolveStatus("正解です！素晴らしい！", "success");
    const storyText = currentSolveProblem.story?.trim();
    setStoryTitle(currentSolveIndex + 1);
    setSolveStory(
      storyText || "宇宙の記憶はまだ設定されていません。",
      true
    );
    triggerStoryReveal();
    setView("story");
  } else {
    setSolveStatus("不正解です。もう一度チャレンジしてください。", "error");
    setSolveStory();
  }
}

function setView(view) {
  viewSections.forEach((section) => {
    const views = (section.dataset.view || "").split(" ").filter(Boolean);
    section.hidden = views.length > 0 ? !views.includes(view) : false;
  });
  viewButtons.forEach((button) => {
    const isActive = button.getAttribute("data-view-button") === view;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  document.body.classList.toggle("is-story-view", view === "story");
  if (view !== "story") {
    setSolveStory();
    setStoryTitle();
  }
}

function renderRegisteredProblems(problems = getStoredProblems()) {
  if (!registeredList) {
    return;
  }
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

    if (problem.story) {
      const story = document.createElement("p");
      story.className = "registered-story";
      story.textContent = problem.story;
      content.appendChild(story);
    }

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
      renderRegisteredProblems(updatedProblems);
      renderSolveOptions(getAllProblems());
      setRegisterStatus(`現在の登録数: ${updatedProblems.length}`);
      updateProblemsExport();
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
  const storyText = storyInput ? storyInput.value.trim() : "";
  const payload = {
    svg: currentSvgText,
    grid: answerState.map((row) => row.slice()),
    story: storyText,
    createdAt: new Date().toISOString()
  };
  problems.push(payload);
  setStoredProblems(problems);
  if (registerOutput) {
    registerOutput.textContent = "";
    registerOutput.classList.remove("is-visible");
  }
  renderRegisteredProblems(problems);
  renderSolveOptions(getAllProblems());
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
      renderSvgPreview(
        currentSvgText,
        questionSvgPreview,
        "ここに問題SVGが表示されます。"
      );
      syncAnswerPayload();
    };
    reader.readAsText(file);
  });
}

clearSvgPreview(questionSvgPreview, "ここに問題SVGが表示されます。");
clearSvgPreview(
  solveSvgPreview,
  "ここに選択した問題SVGが表示されます。"
);
syncAnswerPayload();
renderRegisteredProblems();
setRegisterStatus(`現在の登録数: ${getStoredProblems().length}`);
setSolveMeta("problems.json を読み込み中...");
setView("solve");

async function initializeProblems() {
  try {
    const response = await fetch(PROBLEMS_JSON_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();
    initialProblems = Array.isArray(data) ? data : [];
  } catch (error) {
    initialProblems = [];
    setSolveMeta("problems.json を読み込めませんでした。");
  }
  renderSolveOptions(getAllProblems());
}

initializeProblems();
