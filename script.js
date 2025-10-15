// ============================================
// 🎮 JUEGO DE MEMORIA - PRÁCTICA DE JAVASCRIPT
// ============================================

// PASO 1: DECLARAR VARIABLES GLOBALES
// ============================================

// 1.1 Array con 8 emojis diferentes para las cartas
const emojis = ["🍎", "🍌", "🍇", "🍒", "🍉", "🥝", "🍍", "🍓"];

// 1.2 Variables de estado del juego
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// PASO 2: FUNCIÓN PRINCIPAL - INICIALIZAR EL JUEGO
// ============================================
function initGame() {
  const gameContainer = document.createElement("div");
  gameContainer.id = "game-container";
  document.body.appendChild(gameContainer);

  createHeader(gameContainer);
  createGameBoard(gameContainer);
  createButtons(gameContainer);
  createModal();

  startNewGame();
}

// PASO 3: CREAR EL HEADER CON TÍTULO Y ESTADÍSTICAS
// ============================================
function createHeader(container) {
  const header = document.createElement("div");
  header.classList.add("game-header");

  const title = document.createElement("h1");
  title.textContent = "🧠 Juego de Memoria";

  const stats = document.createElement("div");
  stats.classList.add("stats");
  stats.innerHTML = `
    <div class="stat-item">Movimientos: <span id="moves">0</span></div>
    <div class="stat-item">Pares: <span id="pairs">0/${emojis.length}</span></div>
  `;

  header.appendChild(title);
  header.appendChild(stats);
  container.appendChild(header);
}

// PASO 4: CREAR EL TABLERO DE JUEGO
// ============================================
function createGameBoard(container) {
  const board = document.createElement("div");
  board.classList.add("game-board");
  board.id = "game-board";
  container.appendChild(board);
}

// PASO 5: CREAR BOTONES DE CONTROL
// ============================================
function createButtons(container) {
  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");

  const restartBtn = document.createElement("button");
  restartBtn.textContent = "🔄 Reiniciar";
  restartBtn.onclick = startNewGame;

  buttonsDiv.appendChild(restartBtn);
  container.appendChild(buttonsDiv);
}

// PASO 6: CREAR MODAL DE VICTORIA
// ============================================
function createModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  modal.id = "victory-modal";

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.innerHTML = `
    <h2>🎉 ¡Felicidades!</h2>
    <p>Has completado el juego</p>
    <p id="final-moves"></p>
    <button onclick="closeModal()">Cerrar</button>
    <button onclick="startNewGame()">Jugar otra vez</button>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// PASO 7: INICIAR NUEVO JUEGO
// ============================================
function startNewGame() {
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  canFlip = true;
  updateStats();

  cards = createCards();
  shuffleCards(cards);
  renderBoard();
}

// PASO 8: CREAR ARRAY DE CARTAS
// ============================================
function createCards() {
  const duplicated = [...emojis, ...emojis];
  return duplicated.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false,
  }));
}

// PASO 9: MEZCLAR CARTAS (Fisher-Yates)
// ============================================
function shuffleCards(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// PASO 10: RENDERIZAR EL TABLERO
// ============================================
function renderBoard() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";

  cards.forEach((card) => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.dataset.id = card.id;

    if (card.flipped || card.matched) {
      cardEl.classList.add("flipped");
      cardEl.textContent = card.emoji;
    }

    cardEl.addEventListener("click", () => flipCard(card.id));
    board.appendChild(cardEl);
  });
}

// PASO 11: VOLTEAR UNA CARTA
// ============================================
function flipCard(cardId) {
  if (!canFlip) return;
  if (flippedCards.length === 2) return;

  const card = cards.find((c) => c.id === cardId);
  if (card.flipped || card.matched) return;

  card.flipped = true;
  flippedCards.push(card);
  renderBoard();

  if (flippedCards.length === 2) {
    moves++;
    updateStats();
    checkMatch();
  }
}

// PASO 12: VERIFICAR SI HAY COINCIDENCIA
// ============================================
function checkMatch() {
  canFlip = false;
  const [card1, card2] = flippedCards;

  if (card1.emoji === card2.emoji) {
    setTimeout(() => {
      card1.matched = true;
      card2.matched = true;
      matchedPairs++;
      flippedCards = [];
      canFlip = true;
      updateStats();
      renderBoard();

      if (matchedPairs === emojis.length) {
        showVictory();
      }
    }, 500);
  } else {
    setTimeout(() => {
      card1.flipped = false;
      card2.flipped = false;
      flippedCards = [];
      canFlip = true;
      renderBoard();
    }, 1000);
  }
}

// PASO 13: ACTUALIZAR ESTADÍSTICAS
// ============================================
function updateStats() {
  document.getElementById("moves").textContent = moves;
  document.getElementById("pairs").textContent = `${matchedPairs}/${emojis.length}`;
}

// PASO 14: MOSTRAR MODAL DE VICTORIA
// ============================================
function showVictory() {
  const modal = document.getElementById("victory-modal");
  const finalMoves = document.getElementById("final-moves");
  finalMoves.textContent = `Lo completaste en ${moves} movimientos 🎯`;
  modal.classList.add("show");
}

// PASO 15: CERRAR MODAL
// ============================================
function closeModal() {
  const modal = document.getElementById("victory-modal");
  modal.classList.remove("show");
}

// PASO 16: INICIAR EL JUEGO AL CARGAR LA PÁGINA
// ============================================
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGame);
} else {
  initGame();
}
