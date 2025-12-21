const questionSvgInput = document.getElementById("question-svg-input");
const questionSvgPreview = document.getElementById("question-svg-preview");
const answerGridElement = document.getElementById("answer-grid");
const answerJsonInput = document.getElementById("answer-json");
const resetButton = document.getElementById("reset-grid");
const resetQuestionButton = document.getElementById("reset-question");

const GRID_SIZE = 4;
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
  renderGrid(answerGridElement, answerState, {
    interactive: true,
    onCellUpdate: syncAnswerPayload
  });
  syncAnswerPayload();
}

function resetQuestionGrid() {
  currentSvgText = "";
  clearSvgPreview();
  syncAnswerPayload();
}

resetButton.addEventListener("click", resetGrid);
resetQuestionButton.addEventListener("click", resetQuestionGrid);

renderGrid(answerGridElement, answerState, {
  interactive: true,
  onCellUpdate: syncAnswerPayload
});

function clearSvgPreview() {
  questionSvgPreview.innerHTML = "<p>ここに問題SVGが表示されます。</p>";
}

function renderSvgPreview(svgText) {
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  questionSvgPreview.innerHTML = "";
  if (svgElement) {
    questionSvgPreview.appendChild(svgElement);
  } else {
    questionSvgPreview.innerHTML = "<p>SVGの読み込みに失敗しました。</p>";
  }
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

questionSvgInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    currentSvgText = reader.result;
    renderSvgPreview(currentSvgText);
    syncAnswerPayload();
  };
  reader.readAsText(file);
});

clearSvgPreview();
syncAnswerPayload();
