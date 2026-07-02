const questionSvgInput = document.getElementById("question-svg-input");
const questionSvgPreview = document.getElementById("question-svg-preview");
const answerGridElement = document.getElementById("answer-grid");
const answerJsonInput = document.getElementById("answer-json");
const resetButton = document.getElementById("reset-grid");
const resetQuestionButton = document.getElementById("reset-question");
const registerButton = document.getElementById("register-problem");
const registerStatus = document.getElementById("register-status");
const registerOutput = document.getElementById("register-output");
const registerCopyButton = document.getElementById("register-copy");
const registerCopyStatus = document.getElementById("register-copy-status");
const registeredList = document.getElementById("registered-list");
const registeredEmpty = document.getElementById("registered-empty");
const registeredCount = document.getElementById("registered-count");
const exportProblemsButton = document.getElementById("export-problems-json");
const importProblemsInput = document.getElementById("import-problems-json");
const storyInput = document.getElementById("story-input");
const storyInputEn = document.getElementById("story-input-en");
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
const languageButtons = document.querySelectorAll("[data-language]");

const I18N = {
  ja: {
    pageTitle: "OrigamiStory - 宇宙の謎を解く",
    "hero.subtitle": "宇宙の謎を解く",
    "hero.description": "登録された宇宙の謎に対して4×4の図形を入力し、答え合わせを行います。",
    "story.reveal": "宇宙の謎をひとつ解き明かした！",
    "footer.title": "OrigamiStory - 宇宙の謎を解く",
    storyTitle: "宇宙の記憶",
    storyTitleNumber: (n) => `宇宙の記憶 No.${n}`,
    registeredCount: (n) => `登録数: ${n}`,
    problemName: (n) => `宇宙の謎 ${n}`,
    noProblemsOption: "登録された宇宙の謎がありません",
    noProblemsMeta: "登録された宇宙の謎がありません。",
    noProblemsStatus: "宇宙の謎を登録するとここで解答できます。",
    selectedSvgPlaceholder: "ここに選択した宇宙の謎SVGが表示されます。",
    questionSvgPlaceholder: "ここに宇宙の謎SVGが表示されます。",
    answerPrompt: "回答を入力して提出してください。",
    selectPrompt: "宇宙の謎を選択してください。",
    chooseProblem: "解く宇宙の謎を選択してください。",
    correct: "正解です！素晴らしい！",
    noStory: "宇宙の記憶はまだ設定されていません。",
    incorrect: "不正解です。もう一度チャレンジしてください。",
    uploadSvg: "宇宙の謎SVGをアップロードしてください。",
    needShape: "答えの図形を1つ以上入力してください。",
    registerCount: (n) => `現在の登録数: ${n}`,
    deleteMissing: "削除対象のIDが見つかりません。",
    deleteFailed: (m) => `削除に失敗しました: ${m}`,
    registerFailed: (m) => `登録に失敗しました: ${m}`,
    copySuccess: "JSONをコピーしました。",
    copyFailed: "コピーに失敗しました。",
    exportRemoved: "JSON書き出しは廃止しました。Supabaseを直接ご利用ください。",
    importRemoved: "JSON読み込みは廃止しました。Supabaseへ直接登録してください。",
    loading: "Supabaseから宇宙の謎を読み込み中...",
    configPrefix: (m) => `Supabase設定エラー: ${m}（supabase-config.jsを確認してください）`,
    unavailable: (m) => `読み込み不可: ${m}`,
    fixConfig: "Supabase設定を修正後に再読み込みしてください。",
    loadFailedNetwork: (u) => `読み込み失敗: ネットワークまたはURL解決に失敗しました。SUPABASE_URL を確認してください（現在: ${u}）。`,
    loadFailed: (m) => `読み込み失敗: ${m}`,
    checkSupabase: "SupabaseのURL・APIキー・RLS設定を確認してください。",
    deleteButton: "削除",
    noSvg: "SVGなし",
    registeredSvgAlt: "登録済みの宇宙の謎SVG",
    languageSelector: "言語選択",
    heroAria: "OrigamiStory 宇宙の謎を解く",
    solveSelectAria: "宇宙の謎選択",
    solveSvgPreviewAria: "選択中の宇宙の謎SVG",
    solveGridAria: "回答用4x4図形グリッド",
    storyPlaceholder: "例: 正解の先に広がる物語をここに入力します。",
    storyPlaceholderEn: "例: 英語版の物語をここに入力します。",
    questionSvgPreviewAria: "SVGプレビュー",
    registerOutputAria: "入力内容のJSON",
    previewNotReady: "SVGと図形と宇宙の記憶を入力するとJSONが表示されます。"
  },
  en: {
    pageTitle: "OrigamiStory - Solve the Mysteries of Space",
    "hero.subtitle": "Solve the Mysteries of Space",
    "hero.description": "Choose a registered space mystery, enter the resulting 4×4 shape pattern, and check your answer.",
    "story.reveal": "You uncovered one of space's mysteries!",
    "footer.title": "OrigamiStory - Solve the Mysteries of Space",
    storyTitle: "Cosmic Memory",
    storyTitleNumber: (n) => `Cosmic Memory No.${n}`,
    registeredCount: (n) => `Registered: ${n}`,
    problemName: (n) => `Space Mystery ${n}`,
    noProblemsOption: "No space mysteries are registered",
    noProblemsMeta: "No space mysteries are registered.",
    noProblemsStatus: "Register a space mystery to solve it here.",
    selectedSvgPlaceholder: "The selected space mystery SVG will appear here.",
    questionSvgPlaceholder: "The space mystery SVG will appear here.",
    answerPrompt: "Enter your answer and submit it.",
    selectPrompt: "Please choose a space mystery.",
    chooseProblem: "Please choose a space mystery to solve.",
    correct: "Correct! Excellent work!",
    noStory: "No cosmic memory has been set yet.",
    incorrect: "Not quite. Try again.",
    uploadSvg: "Please upload a space mystery SVG.",
    needShape: "Please enter at least one answer shape.",
    registerCount: (n) => `Current registrations: ${n}`,
    deleteMissing: "Could not find the ID to delete.",
    deleteFailed: (m) => `Delete failed: ${m}`,
    registerFailed: (m) => `Registration failed: ${m}`,
    copySuccess: "Copied JSON.",
    copyFailed: "Copy failed.",
    exportRemoved: "JSON export has been discontinued. Please use Supabase directly.",
    importRemoved: "JSON import has been discontinued. Please register directly in Supabase.",
    loading: "Loading space mysteries from Supabase...",
    configPrefix: (m) => `Supabase configuration error: ${m} (check supabase-config.js)`,
    unavailable: (m) => `Cannot load: ${m}`,
    fixConfig: "Fix the Supabase settings, then reload.",
    loadFailedNetwork: (u) => `Load failed: network or URL resolution failed. Check SUPABASE_URL (current: ${u}).`,
    loadFailed: (m) => `Load failed: ${m}`,
    checkSupabase: "Check the Supabase URL, API key, and RLS settings.",
    deleteButton: "Delete",
    noSvg: "No SVG",
    registeredSvgAlt: "Registered space mystery SVG",
    languageSelector: "Language selector",
    heroAria: "OrigamiStory Solve the Mysteries of Space",
    solveSelectAria: "Space mystery selection",
    solveSvgPreviewAria: "Selected space mystery SVG",
    solveGridAria: "4x4 answer shape grid",
    storyPlaceholder: "Example: Enter the story that unfolds beyond the correct answer.",
    storyPlaceholderEn: "Example: Enter the English version of the story here.",
    questionSvgPreviewAria: "SVG preview",
    registerOutputAria: "Input JSON",
    previewNotReady: "Enter an SVG, shapes, and a cosmic memory to preview the JSON."
  }
};


const STATIC_TEXT = {
  ja: {
    "solve1Title": "1. 宇宙の謎を選択",
    "solve1Body": "登録されている宇宙の謎から解きたいものを選びます。",
    "solveLabel": "宇宙の謎一覧",
    "solve2Title": "2. 宇宙の謎の表示",
    "solve2Body": "下の画像は折り紙の展開図です。\n赤線→山折り(Mountain)\n青線→谷折り(Valley)\n折った後にできる形を下のパネルに入力して下さい。",
    "solve3Title": "3. 図形で回答",
    "shapeHelp": "クリックで「空白 → 正方形 → 三角形」へ切り替えます。",
    "resetShape": "図形をリセット",
    "solve4Title": "4. 回答を提出",
    "solve4Body": "入力された図形が登録された答えと一致するかを判定します。",
    "submitAnswer": "回答を提出する",
    "initialSolve": "宇宙の謎を選択して回答を入力してください。",
    "storyLead": "正解したときだけ、物語が宇宙の中央に現れます。",
    "storyBack": "宇宙の謎に戻る",
    "uploadTitle": "1. SVGをアップロード",
    "svgLabel": "宇宙の謎SVG",
    "clearSvg": "SVGをクリア",
    "inputTitle": "2. 図形を入力 (4×4)",
    "inputBody": "クリックで「空白 → 正方形 → 三角形」へ切り替えます。1つでも入力すれば登録できます。",
    "storyInputTitle": "3. 宇宙の記憶を入力",
    "storyInputBody": "宇宙の謎を解いたときに表示したい宇宙の記憶を入力します。",
    "storyInputLabel": "宇宙の記憶本文",
    "storyInputLabelJa": "宇宙の記憶（日本語）",
    "storyInputLabelEn": "宇宙の記憶（英語）",
    "previewTitle": "4. SVGプレビュー",
    "registerTitle": "5. 宇宙の謎を登録",
    "registerBody": "宇宙の謎SVGと答え（4×4の図形）を1つ以上入力したら登録できます。",
    "registerButton": "登録する",
    "registerInitial": "まだ登録されていません。",
    "jsonPreview": "JSONプレビュー",
    "copy": "コピー",
    "registeredTitle": "6. 登録済みの宇宙の謎",
    "registeredBody": "登録した宇宙の謎を一覧で確認し、不要なものを削除できます。",
    "exportJson": "JSONを書き出す",
    "importJson": "JSONを読み込む",
    "countLabel": "登録数:",
    "emptyRegistered": "登録済みの宇宙の謎はまだありません。"
  },
  en: {
    "solve1Title": "1. Choose a Space Mystery",
    "solve1Body": "Pick the registered space mystery you want to solve.",
    "solveLabel": "Space mystery list",
    "solve2Title": "2. View the Space Mystery",
    "solve2Body": "The image below is an origami crease pattern.\nRed lines = Mountain folds\nBlue lines = Valley folds\nEnter the shape that appears after folding in the panel below.",
    "solve3Title": "3. Answer with Shapes",
    "shapeHelp": "Click to cycle: Blank → Square → Triangle.",
    "resetShape": "Reset shapes",
    "solve4Title": "4. Submit Your Answer",
    "solve4Body": "Check whether your shape pattern matches the registered answer.",
    "submitAnswer": "Submit answer",
    "initialSolve": "Choose a space mystery and enter your answer.",
    "storyLead": "The story appears at the center of space only when your answer is correct.",
    "storyBack": "Back to mysteries",
    "uploadTitle": "1. Upload an SVG",
    "svgLabel": "Space mystery SVG",
    "clearSvg": "Clear SVG",
    "inputTitle": "2. Enter Shapes (4×4)",
    "inputBody": "Click to cycle: Blank → Square → Triangle. You can register once at least one shape is entered.",
    "storyInputTitle": "3. Enter a Cosmic Memory",
    "storyInputBody": "Enter the cosmic memory to show after this mystery is solved.",
    "storyInputLabel": "Cosmic memory text",
    "storyInputLabelJa": "Cosmic memory (Japanese)",
    "storyInputLabelEn": "Cosmic memory (English)",
    "previewTitle": "4. SVG Preview",
    "registerTitle": "5. Register the Space Mystery",
    "registerBody": "Register after adding a space mystery SVG and at least one answer shape in the 4×4 grid.",
    "registerButton": "Register",
    "registerInitial": "Not registered yet.",
    "jsonPreview": "JSON Preview",
    "copy": "Copy",
    "registeredTitle": "6. Registered Space Mysteries",
    "registeredBody": "Review registered mysteries and delete any you no longer need.",
    "exportJson": "Export JSON",
    "importJson": "Import JSON",
    "countLabel": "Registered:",
    "emptyRegistered": "No space mysteries have been registered yet."
  }
};
function getStoredLanguage() {
  try {
    return localStorage.getItem("origamiLanguage");
  } catch {
    return null;
  }
}
function setStoredLanguage(language) {
  try {
    localStorage.setItem("origamiLanguage", language);
  } catch {
    // Ignore storage failures so language switching still works in restricted browsers.
  }
}
function refreshInitialStatuses() {
  if (solveResult && !solveResult.classList.contains("is-error") && !solveResult.classList.contains("is-success") && !currentSolveProblem) {
    solveResult.textContent = t("initialSolve");
  }
  if (registerStatus && !registerStatus.classList.contains("is-error") && !registerStatus.classList.contains("is-success") && problemsCache.length === 0) {
    registerStatus.textContent = t("registerInitial");
  }
}
const storedLanguage = getStoredLanguage();
let currentLanguage = I18N[storedLanguage] ? storedLanguage : "en";
function t(key, ...args) {
  const dictionary = I18N[currentLanguage] || I18N.ja;
  const staticDictionary = STATIC_TEXT[currentLanguage] || STATIC_TEXT.ja;
  const value =
    dictionary[key] ??
    I18N.ja[key] ??
    staticDictionary[key] ??
    STATIC_TEXT.ja[key] ??
    key;
  return typeof value === "function" ? value(...args) : value;
}
function applyLanguage() {
  document.documentElement.lang = currentLanguage;
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
  refreshInitialStatuses();
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === currentLanguage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

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
const solveState = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }, () => "empty")
);
let currentSvgText = "";
let currentSolveIndex = null;
let currentSolveProblem = null;
let storyRevealTimeoutId = null;
const supabaseRuntimeConfig = window.ORIGAMI_SUPABASE_CONFIG || {};
function isPlaceholderText(rawValue) {
  const text = typeof rawValue === "string" ? rawValue.trim().toLowerCase() : "";
  if (!text) {
    return false;
  }
  const placeholderTokens = [
    "your_project_ref",
    "your-project-ref",
    "your_project_url",
    "your-supabase",
    "your_supabase",
    "your-anon-key",
    "your_anon_key",
    "<project-ref>",
    "<your-anon-key>",
    "<your_supabase",
    "example.supabase.co"
  ];
  return placeholderTokens.some((token) => text.includes(token));
}
function normalizeSupabaseUrl(rawUrl) {
  const source = typeof rawUrl === "string" ? rawUrl.trim() : "";
  if (!source) {
    return "";
  }
  if (isPlaceholderText(source)) {
    return "";
  }
  if (/^https?:\/\//i.test(source)) {
    return source;
  }
  if (/^[a-z0-9-]+$/i.test(source)) {
    return `https://${source}.supabase.co`;
  }
  return source;
}
function isValidHttpUrl(urlText) {
  if (!urlText) {
    return false;
  }
  try {
    const parsed = new URL(urlText);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
function normalizeSupabaseAnonKey(rawKey) {
  const source = typeof rawKey === "string" ? rawKey.trim() : "";
  if (!source || isPlaceholderText(source)) {
    return "";
  }
  return source;
}
function isLikelySupabaseProjectUrl(urlText) {
  if (!isValidHttpUrl(urlText)) {
    return false;
  }
  try {
    const parsed = new URL(urlText);
    const hostname = parsed.hostname.toLowerCase();
    if (!hostname.endsWith(".supabase.co")) {
      return false;
    }
    const projectRef = hostname.replace(".supabase.co", "");
    return /^[a-z0-9-]{6,30}$/.test(projectRef);
  } catch {
    return false;
  }
}
const SUPABASE_URL =
  normalizeSupabaseUrl(
    supabaseRuntimeConfig.url ||
      window.SUPABASE_URL ||
      window.SUPABASE_PROJECT_URL ||
      window.NEXT_PUBLIC_SUPABASE_URL ||
      ""
  );
const SUPABASE_ANON_KEY =
  normalizeSupabaseAnonKey(
    supabaseRuntimeConfig.anonKey ||
      window.SUPABASE_ANON_KEY ||
      window.SUPABASE_KEY ||
      window.SUPABASE_API_KEY ||
      window.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      ""
  );
const hasValidSupabaseUrl = isValidHttpUrl(SUPABASE_URL);
const hasLikelySupabaseUrl = isLikelySupabaseProjectUrl(SUPABASE_URL);
const supabaseSdk = window.supabase || window.supabaseJs || null;
const supabaseClient =
  supabaseSdk && hasValidSupabaseUrl && hasLikelySupabaseUrl && SUPABASE_ANON_KEY
    ? supabaseSdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
let problemsCache = [];

function getSupabaseConfigError() {
  if (!supabaseSdk) {
    return "Supabase SDKの読み込みに失敗しました。";
  }
  if (!SUPABASE_URL) {
    return "SUPABASE_URL が未設定、またはプレースホルダー値のままです。";
  }
  if (!hasValidSupabaseUrl) {
    return `SUPABASE_URL が不正です: ${SUPABASE_URL}`;
  }
  if (!hasLikelySupabaseUrl) {
    return `SUPABASE_URL が Supabase のプロジェクトURL形式ではありません: ${SUPABASE_URL}`;
  }
  if (!hasValidSupabaseUrl) {
    return `SUPABASE_URL が不正です: ${SUPABASE_URL}`;
  }
  if (!SUPABASE_ANON_KEY) {
    return "SUPABASE_ANON_KEY が未設定、またはプレースホルダー値のままです。";
  }
  return "";
}

function normalizeProblem(problem) {
  return {
    id: problem.id,
    svg: problem.svg,
    grid: problem.grid,
    story: typeof problem.story === "string" ? problem.story : "",
    storyEn: typeof problem.story_en === "string" ? problem.story_en : "",
    createdAt: problem.created_at || problem.createdAt || ""
  };
}

async function fetchProblemsFromSupabase() {
  if (!supabaseClient) {
    throw new Error("Supabase client is not configured.");
  }
  const { data, error } = await supabaseClient
    .from("problems")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) {
    throw error;
  }
  return (data || []).map(normalizeProblem);
}

async function createProblemInSupabase(payload) {
  if (!supabaseClient) {
    throw new Error("Supabase client is not configured.");
  }
  const { data, error } = await supabaseClient
    .from("problems")
    .insert([
      {
        svg: payload.svg,
        grid: payload.grid,
        story: payload.story,
        story_en: payload.storyEn || ""
      }
    ])
    .select("*")
    .single();
  if (error) {
    throw error;
  }
  return normalizeProblem(data);
}

async function deleteProblemInSupabase(id) {
  if (!supabaseClient) {
    throw new Error("Supabase client is not configured.");
  }
  const { error } = await supabaseClient.from("problems").delete().eq("id", id);
  if (error) {
    throw error;
  }
}

function formatDate(isoString) {
  if (!isoString) {
    return "";
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString(currentLanguage === "en" ? "en-US" : "ja-JP");
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
        setSolveStatus(t("answerPrompt"));
      }
    });
  }
}

function resetQuestionGrid() {
  currentSvgText = "";
  clearSvgPreview(questionSvgPreview, t("questionSvgPlaceholder"));
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
if (languageButtons.length) {
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextLanguage = button.dataset.language;
      if (!I18N[nextLanguage] || nextLanguage === currentLanguage) {
        return;
      }
      currentLanguage = nextLanguage;
      setStoredLanguage(currentLanguage);
      applyLanguage();
      renderSolveOptions(problemsCache);
      renderRegisteredProblems(problemsCache);
      setStoryTitle(currentSolveIndex === null ? null : currentSolveIndex + 1);
      if (currentSolveProblem && solveStory && !solveStory.hidden) {
        setSolveStory(getProblemStory(currentSolveProblem) || t("noStory"), true);
      }
    });
  });
}

if (viewButtons.length) {
  viewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetView = button.getAttribute("data-view-button");
      if (targetView) {
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

function thickenFoldLines(svgElement) {
  if (!svgElement) {
    return;
  }
  const selectors = [
    '[stroke="red"]',
    '[stroke="#ff0000"]',
    '[stroke="#f00"]',
    '[stroke="blue"]',
    '[stroke="#0000ff"]',
    '[stroke="#00f"]',
    '[style*="stroke:red"]',
    '[style*="stroke: red"]',
    '[style*="stroke:#ff0000"]',
    '[style*="stroke: #ff0000"]',
    '[style*="stroke:#f00"]',
    '[style*="stroke: #f00"]',
    '[style*="stroke:blue"]',
    '[style*="stroke: blue"]',
    '[style*="stroke:#0000ff"]',
    '[style*="stroke: #0000ff"]',
    '[style*="stroke:#00f"]',
    '[style*="stroke: #00f"]'
  ];
  const foldLines = svgElement.querySelectorAll(selectors.join(","));
  foldLines.forEach((element) => {
    const rawWidth = element.getAttribute("stroke-width") || element.style.strokeWidth;
    const baseWidth = Number.parseFloat(rawWidth);
    const resolvedWidth = Number.isFinite(baseWidth) ? baseWidth : 2;
    const newWidth = Math.max(resolvedWidth + 1, resolvedWidth * 1.4);
    element.style.strokeWidth = `${newWidth}px`;
    element.setAttribute("stroke-width", newWidth.toString());
  });
}

function renderSvgPreview(svgText, targetElement, placeholderText) {
  if (!targetElement) {
    return;
  }
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  targetElement.innerHTML = "";
  if (svgElement) {
    thickenFoldLines(svgElement);
    targetElement.appendChild(svgElement);
  } else {
    clearSvgPreview(targetElement, placeholderText);
  }
}

function createSvgThumbnail(svgText) {
  const wrapper = document.createElement("div");
  wrapper.className = "registered-svg";
  if (!svgText) {
    wrapper.innerHTML = `<p>${t("noSvg")}</p>`;
    return wrapper;
  }
  const parsed = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svgElement = parsed.querySelector("svg");
  let svgSource = svgText;
  if (svgElement) {
    thickenFoldLines(svgElement);
    svgSource = new XMLSerializer().serializeToString(svgElement);
  }
  const img = document.createElement("img");
  img.alt = t("registeredSvgAlt");
  img.loading = "lazy";
  img.decoding = "async";
  img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svgSource)}`;
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
  updateRegisterPreview();
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

function setCopyStatus(message, type = "info") {
  if (!registerCopyStatus) {
    return;
  }
  registerCopyStatus.textContent = message;
  registerCopyStatus.classList.remove("is-error", "is-success");
  if (type === "error") {
    registerCopyStatus.classList.add("is-error");
  }
  if (type === "success") {
    registerCopyStatus.classList.add("is-success");
  }
}

function getDraftPayload() {
  return {
    svg: currentSvgText,
    grid: answerState.map((row) => row.slice()),
    story: storyInput ? storyInput.value.trim() : "",
    storyEn: storyInputEn ? storyInputEn.value.trim() : ""
  };
}

function isDraftReady() {
  const storyText = storyInput ? storyInput.value.trim() : "";
  const storyTextEn = storyInputEn ? storyInputEn.value.trim() : "";
  return (
    Boolean(currentSvgText) &&
    getFilledCellCount() > 0 &&
    (storyText.length > 0 || storyTextEn.length > 0)
  );
}

function updateRegisterPreview() {
  if (!registerOutput) {
    return;
  }
  if (!isDraftReady()) {
    registerOutput.textContent =
      t("previewNotReady");
    registerOutput.classList.remove("is-filled");
    if (registerCopyButton) {
      registerCopyButton.disabled = true;
    }
    setCopyStatus("");
    return;
  }
  const payload = JSON.stringify(getDraftPayload(), null, 2);
  registerOutput.textContent = payload;
  registerOutput.classList.add("is-filled");
  if (registerCopyButton) {
    registerCopyButton.disabled = false;
  }
}

function copyTextToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const temp = document.createElement("textarea");
    temp.value = text;
    temp.setAttribute("readonly", "");
    temp.style.position = "absolute";
    temp.style.left = "-9999px";
    document.body.appendChild(temp);
    temp.select();
    const success = document.execCommand("copy");
    document.body.removeChild(temp);
    if (success) {
      resolve();
    } else {
      reject();
    }
  });
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

function getProblemStory(problem) {
  if (!problem) {
    return "";
  }
  const englishStory = (problem.storyEn || "").trim();
  const japaneseStory = (problem.story || "").trim();
  if (currentLanguage === "en") {
    return englishStory || japaneseStory;
  }
  return japaneseStory || englishStory;
}

function setStoryTitle(index = null) {
  if (!storyTitle) {
    return;
  }
  if (index === null) {
    storyTitle.textContent = t("storyTitle");
    return;
  }
  storyTitle.textContent = t("storyTitleNumber", index);
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

function renderSolveOptions(problems = problemsCache) {
  if (!solveProblemSelect) {
    return;
  }
  solveProblemSelect.innerHTML = "";
  if (problems.length === 0) {
    const option = document.createElement("option");
    option.textContent = t("noProblemsOption");
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
      t("selectedSvgPlaceholder")
    );
    setSolveMeta(t("noProblemsMeta"));
    setSolveStatus(t("noProblemsStatus"));
    setSolveStory();
    return;
  }
  solveProblemSelect.disabled = false;
  problems.forEach((problem, index) => {
    const option = document.createElement("option");
    option.value = index.toString();
    option.textContent = t("problemName", index + 1);
    solveProblemSelect.appendChild(option);
  });
  if (currentSolveIndex !== null && currentSolveIndex < problems.length) {
    solveProblemSelect.value = currentSolveIndex.toString();
  } else {
    solveProblemSelect.value = "0";
  }
  setSolveMeta(t("registeredCount", problems.length));
  loadSelectedProblem(problems);
}

function loadSelectedProblem(problems = problemsCache) {
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
      t("selectedSvgPlaceholder")
    );
    setSolveStatus(t("selectPrompt"));
    setSolveStory();
    return;
  }
  currentSolveIndex = index;
  currentSolveProblem = problems[index];
  renderSvgPreview(
    currentSolveProblem.svg,
    solveSvgPreview,
    t("selectedSvgPlaceholder")
  );
  resetSolveGrid();
  setSolveStatus(t("answerPrompt"));
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
    setSolveStatus(t("chooseProblem"), "error");
    setSolveStory();
    return;
  }
  const isCorrect = isShapeCountMatch(solveState, currentSolveProblem.grid);
  if (isCorrect) {
    setSolveStatus(t("correct"), "success");
    const storyText = getProblemStory(currentSolveProblem);
    setStoryTitle(currentSolveIndex + 1);
    setSolveStory(
      storyText || t("noStory"),
      true
    );
    triggerStoryReveal();
    setView("story");
  } else {
    setSolveStatus(t("incorrect"), "error");
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

function renderRegisteredProblems(problems = problemsCache) {
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
    title.textContent = t("problemName", index + 1);
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

    const registeredStory = getProblemStory(problem);
    if (registeredStory) {
      const story = document.createElement("p");
      story.className = "registered-story";
      story.textContent = registeredStory;
      content.appendChild(story);
    }

    const actions = document.createElement("div");
    actions.className = "registered-actions";
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = t("deleteButton");
    deleteButton.addEventListener("click", async () => {
      const target = problems[index];
      if (!target?.id) {
        setRegisterStatus(t("deleteMissing"), "error");
        return;
      }
      try {
        await deleteProblemInSupabase(target.id);
        problemsCache = problemsCache.filter((problem) => problem.id !== target.id);
        renderRegisteredProblems(problemsCache);
        renderSolveOptions(problemsCache);
        setRegisterStatus(t("registerCount", problemsCache.length));
      } catch (error) {
        setRegisterStatus(t("deleteFailed", error.message), "error");
      }
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

async function handleRegister() {
  if (!currentSvgText) {
    setRegisterStatus(t("uploadSvg"), "error");
    return;
  }
  const filledCellCount = getFilledCellCount();
  if (filledCellCount === 0) {
    setRegisterStatus(t("needShape"), "error");
    return;
  }
  const storyText = storyInput ? storyInput.value.trim() : "";
  const payload = {
    svg: currentSvgText,
    grid: answerState.map((row) => row.slice()),
    story: storyText,
    storyEn: storyInputEn ? storyInputEn.value.trim() : ""
  };
  try {
    const created = await createProblemInSupabase(payload);
    problemsCache.push(created);
    if (registerOutput) {
      registerOutput.textContent = "";
      registerOutput.classList.remove("is-visible");
    }
    renderRegisteredProblems(problemsCache);
    renderSolveOptions(problemsCache);
    setRegisterStatus(t("registerCount", problemsCache.length), "success");
  } catch (error) {
    setRegisterStatus(t("registerFailed", error.message), "error");
  }
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
        t("questionSvgPlaceholder")
      );
      syncAnswerPayload();
    };
    reader.readAsText(file);
  });
}

if (storyInput) {
  storyInput.addEventListener("input", () => {
    updateRegisterPreview();
  });
}

if (storyInputEn) {
  storyInputEn.addEventListener("input", () => {
    updateRegisterPreview();
  });
}

if (registerCopyButton) {
  registerCopyButton.addEventListener("click", () => {
    if (!registerOutput || registerCopyButton.disabled) {
      return;
    }
    const text = registerOutput.textContent;
    if (!text) {
      return;
    }
    copyTextToClipboard(text)
      .then(() => {
        setCopyStatus(t("copySuccess"), "success");
      })
      .catch(() => {
        setCopyStatus(t("copyFailed"), "error");
      });
  });
}

if (exportProblemsButton) {
  exportProblemsButton.addEventListener("click", () => {
    setRegisterStatus(t("exportRemoved"));
  });
}

if (importProblemsInput) {
  importProblemsInput.addEventListener("change", () => {
    setRegisterStatus(t("importRemoved"));
    importProblemsInput.value = "";
  });
}

clearSvgPreview(questionSvgPreview, t("questionSvgPlaceholder"));
clearSvgPreview(
  solveSvgPreview,
  t("selectedSvgPlaceholder")
);
applyLanguage();
syncAnswerPayload();
updateRegisterPreview();

async function init() {
  setSolveMeta(t("loading"));
  setView("solve");
  if (!supabaseClient) {
    const configError = getSupabaseConfigError();
    setRegisterStatus(
      t("configPrefix", configError),
      "error"
    );
    setSolveMeta(t("unavailable", configError));
    setSolveStatus(t("fixConfig"), "error");
    renderRegisteredProblems([]);
    renderSolveOptions([]);
    return;
  }
  try {
    problemsCache = await fetchProblemsFromSupabase();
    renderRegisteredProblems(problemsCache);
    setRegisterStatus(t("registerCount", problemsCache.length));
    renderSolveOptions(problemsCache);
  } catch (error) {
    const rawMessage = error?.message || String(error);
    const networkHints = [
      "Failed to fetch",
      "ERR_NAME_NOT_RESOLVED",
      "NetworkError"
    ];
    const hasNetworkError = networkHints.some((hint) => rawMessage.includes(hint));
    const guidance = hasNetworkError
      ? t("loadFailedNetwork", SUPABASE_URL)
      : t("loadFailed", rawMessage);
    setRegisterStatus(guidance, "error");
    setSolveMeta(guidance);
    setSolveStatus(t("checkSupabase"), "error");
    renderRegisteredProblems([]);
    renderSolveOptions([]);
  }
}

init();
