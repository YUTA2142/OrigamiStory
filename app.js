const gridElement = document.getElementById("answer-grid");
const resultElement = document.getElementById("result");
const svgInput = document.getElementById("svg-input");
const answerInput = document.getElementById("answer-input");
const svgPreview = document.getElementById("svg-preview");
const checkButton = document.getElementById("check-answer");
const resetButton = document.getElementById("reset-grid");

const GRID_SIZE = 4;
const STATES = ["empty", "square", "triangle"];
let answerKey = null;

const gridState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);

function renderGrid() {
  gridElement.innerHTML = "";
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.setAttribute("data-row", row.toString());
      cell.setAttribute("data-col", col.toString());
      cell.setAttribute("aria-label", `row ${row + 1} column ${col + 1}`);
      updateCellVisual(cell, gridState[row][col]);
      cell.addEventListener("click", () => cycleCell(row, col));
      gridElement.appendChild(cell);
    }
  }
}

function updateCellVisual(cell, state) {
  cell.classList.remove("shape-square", "shape-triangle");
  if (state === "square") {
    cell.classList.add("shape-square");
  }
  if (state === "triangle") {
    cell.classList.add("shape-triangle");
  }
}

function cycleCell(row, col) {
  const currentIndex = STATES.indexOf(gridState[row][col]);
  const nextState = STATES[(currentIndex + 1) % STATES.length];
  gridState[row][col] = nextState;
  const cell = gridElement.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  if (cell) {
    updateCellVisual(cell, nextState);
  }
}

function resetGrid() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      gridState[row][col] = "empty";
    }
  }
  renderGrid();
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
  if (!answerKey) {
    setResultMessage("回答キーが読み込まれていません。", "failure");
    return;
  }

  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      if (gridState[row][col] !== answerKey[row][col]) {
        setResultMessage("不正解です。もう一度試してください。", "failure");
        return;
      }
    }
  }

  setResultMessage("正解です！成果として記録されます。", "success");
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

svgInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    svgPreview.innerHTML = reader.result;
  };
  reader.readAsText(file);
});

answerInput.addEventListener("change", (event) => {
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
        answerKey = null;
        return;
      }
      answerKey = parsed;
      setResultMessage("回答キーを読み込みました。", "success");
    } catch (error) {
      setResultMessage("回答キーJSONの読み込みに失敗しました。", "failure");
      answerKey = null;
    }
  };
  reader.readAsText(file);
});

checkButton.addEventListener("click", compareAnswer);
resetButton.addEventListener("click", resetGrid);

renderGrid();
