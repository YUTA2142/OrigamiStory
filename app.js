const questionSvgInput = document.getElementById("question-svg-input");
const questionSvgPreview = document.getElementById("question-svg-preview");
const answerGridElement = document.getElementById("answer-grid");
const resultElement = document.getElementById("result");
const answerKeyInput = document.getElementById("answer-key-input");
const checkButton = document.getElementById("check-answer");
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

const questionState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);
const answerState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);

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
  renderGrid(answerGridElement, answerState, { interactive: true });
  setResultMessage("リセットしました。", "");
}

function setResultMessage(message, status) {
  resultElement.textContent = message;
  resultElement.classList.remove("success", "failure");
  if (status === "success") {
    resultElement.classList.add("success");
  }
  if (status === "failure") {
    resultElement.classList.add("failure");
  }
}

function compareAnswer() {
  if (!hasFilledCells(questionState)) {
    setResultMessage("回答キーが読み込まれていません。", "failure");
    return;
  }

  const matched = compareWithTransformations(questionState, answerState);
  if (matched) {
    setResultMessage("正解です！成果として記録されます。", "success");
  } else {
    setResultMessage("不正解です。もう一度試してください。", "failure");
  }
}

function validateAnswerKey(data) {
  if (!Array.isArray(data) || data.length !== GRID_SIZE) {
    return false;
  }
  return data.every(
    (row) =>
      Array.isArray(row) &&
      row.length === GRID_SIZE &&
      row.every((cell) => STATES.includes(cell))
  );
}

function fillGridState(targetState, data) {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      targetState[row][col] = data[row][col];
    }
  }
}

answerKeyInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!validateAnswerKey(parsed)) {
        setResultMessage("回答キーの形式が正しくありません。", "failure");
        return;
      }
      fillGridState(questionState, parsed);
      setResultMessage("回答キーを読み込みました。", "success");
    } catch (error) {
      setResultMessage("回答キーJSONの読み込みに失敗しました。", "failure");
    }
  };
  reader.readAsText(file);
});

function hasFilledCells(stateGrid) {
  return stateGrid.some((row) => row.some((cell) => cell !== "empty"));
}

function getNormalizedSignature(stateGrid) {
  const cells = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const state = stateGrid[row][col];
      if (state !== "empty") {
        cells.push({ row, col, state });
      }
    }
  }
  if (cells.length === 0) {
    return "";
  }
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  return cells
    .map((cell) => ({
      row: cell.row - minRow,
      col: cell.col - minCol,
      state: cell.state
    }))
    .sort((a, b) => a.row - b.row || a.col - b.col || a.state.localeCompare(b.state))
    .map((cell) => `${cell.row},${cell.col},${cell.state}`)
    .join("|");
}

function flipState(state, mode) {
  if (state === "empty" || state === "square") {
    return state;
  }
  const horizontalMap = {
    "triangle-ne": "triangle-nw",
    "triangle-nw": "triangle-ne",
    "triangle-se": "triangle-sw",
    "triangle-sw": "triangle-se"
  };
  const verticalMap = {
    "triangle-ne": "triangle-se",
    "triangle-se": "triangle-ne",
    "triangle-nw": "triangle-sw",
    "triangle-sw": "triangle-nw"
  };
  if (mode === "horizontal") {
    return horizontalMap[state];
  }
  if (mode === "vertical") {
    return verticalMap[state];
  }
  if (mode === "both") {
    return verticalMap[horizontalMap[state]];
  }
  return state;
}

function flipGrid(stateGrid, mode) {
  const nextGrid = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "empty")
  );
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (mode === "horizontal") {
        nextGrid[row][col] = flipState(
          stateGrid[row][GRID_SIZE - 1 - col],
          mode
        );
      } else if (mode === "vertical") {
        nextGrid[row][col] = flipState(
          stateGrid[GRID_SIZE - 1 - row][col],
          mode
        );
      } else if (mode === "both") {
        nextGrid[row][col] = flipState(
          stateGrid[GRID_SIZE - 1 - row][GRID_SIZE - 1 - col],
          mode
        );
      }
    }
  }
  return nextGrid;
}

function compareWithTransformations(questionGrid, answerGrid) {
  const questionSignature = getNormalizedSignature(questionGrid);
  const transformedGrids = [
    answerGrid,
    flipGrid(answerGrid, "horizontal"),
    flipGrid(answerGrid, "vertical"),
    flipGrid(answerGrid, "both")
  ];
  return transformedGrids.some(
    (grid) => getNormalizedSignature(grid) === questionSignature
  );
}

function resetQuestionGrid() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      questionState[row][col] = "empty";
    }
  }
  answerKeyInput.value = "";
  clearSvgPreview();
  setResultMessage("問題をリセットしました。", "");
}

checkButton.addEventListener("click", compareAnswer);
resetButton.addEventListener("click", resetGrid);
resetQuestionButton.addEventListener("click", resetQuestionGrid);

renderGrid(answerGridElement, answerState, { interactive: true });

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

questionSvgInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    renderSvgPreview(reader.result);
  };
  reader.readAsText(file);
});

clearSvgPreview();
