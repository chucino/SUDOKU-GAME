<script setup lang="ts">
import { ref, onUpdated } from "vue";
import { getUniqueSudoku } from "./sovler/UniqueSudoku";
import {
  SudokuContent,
  SudokuArray,
  ArraySudoku,
} from "./context/SudokuContext";
import MainMenu from "./components/MainMenu.vue";
import Footer from "./components/layout/Footer.vue";
import Header from "./components/layout/Header.vue";
import Difficulty from "./components/Difficulty.vue";
import Records from "./components/Records.vue";
import Timer from "./components/Timer.vue";
import Action from "./components/Action.vue";

let difficulty = ref("Easy");

let clickIndex = ref<number>(82);
let isSolved = ref(false);
let isTimer = ref<boolean>(true);
let mistakes = ref(0);
let isGameOver = ref(false);

let numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const temporaryInitArray = ref<string[]>([]);
const temporarySolvedArray = ref<string[]>([]);
const isExitConfirm = ref(false);
const gameTime = ref("00:00:00");
const showRecords = ref(false);

// Khởi tạo game lần đầu
[temporaryInitArray.value, temporarySolvedArray.value] = getUniqueSudoku(
  difficulty.value,
  difficulty.value,
);

const InitArray = ref<SudokuContent[]>(SudokuArray(temporaryInitArray.value));

function newGame() {
  [temporaryInitArray.value, temporarySolvedArray.value] = getUniqueSudoku(
    difficulty.value,
    difficulty.value,
  );

  InitArray.value = SudokuArray(temporaryInitArray.value);
  clickIndex.value = 82;
  mistakes.value = 0;
  isGameOver.value = false;
  isSolved.value = false;

  // reset timer
  isTimer.value = false;
  setTimeout(() => {
    isTimer.value = true;
  }, 10);
  gameTime.value = "00:00:00";
}

onUpdated(() => {
  if (isGameOver.value || isSolved.value) return;

  const solvedArray: string[] = ArraySudoku(InitArray.value);
  let flag = true;

  for (let i = 0; i < temporarySolvedArray.value.length; i++) {
    if (temporarySolvedArray.value[i] !== solvedArray[i]) {
      flag = false;
      break;
    }
  }

  if (flag === true) {
    isSolved.value = true;
    isTimer.value = false;
    saveRecord(gameTime.value);
  }
});

function numberClick(number: number) {
  if (isPause.value || isGameOver.value || isSolved.value) return;
  if (clickIndex.value === 82) return;

  const currentCell = InitArray.value[clickIndex.value];

  if (currentCell.isLocked === true) {
    const correctValue = temporarySolvedArray.value[clickIndex.value];

    // Kiểm tra đúng sai
    if (number.toString() !== correctValue) {
      mistakes.value++;
      if (mistakes.value >= 5) {
        isGameOver.value = true;
        isTimer.value = false;
      }
    }

    currentCell.content = number.toString();
  }
}

function erase() {
  if (isGameOver.value || isPause.value) return;
  if (clickIndex.value === 82) return;
  if (InitArray.value[clickIndex.value].isLocked === true) {
    InitArray.value[clickIndex.value].content = "";
  }
}

function hint() {
  if (isGameOver.value || isPause.value) return;
  if (clickIndex.value === 82) return;
  if (InitArray.value[clickIndex.value].isLocked === true) {
    InitArray.value[clickIndex.value].content =
      temporarySolvedArray.value[clickIndex.value];
  }
}

function gameClick(index: number) {
  if (isPause.value || isGameOver.value) return;
  clickIndex.value = index;
}

function onClickOverlay() {
  isSolved.value = false;
  newGame();
}

function isSameRowOrColumn(index: number) {
  if (clickIndex.value === 82) return false;
  const selectedRow = Math.floor(clickIndex.value / 9);
  const selectedCol = clickIndex.value % 9;
  const row = Math.floor(index / 9);
  const col = index % 9;
  return row === selectedRow || col === selectedCol;
}

function isDuplicate(index: number) {
  const value = InitArray.value[index].content;
  if (value === "" || value === "0") return false;
  const row = Math.floor(index / 9);
  const col = index % 9;

  for (let i = 0; i < 9; i++) {
    const rowIndex = row * 9 + i;
    const colIndex = i * 9 + col;
    if (rowIndex !== index && InitArray.value[rowIndex].content === value)
      return true;
    if (colIndex !== index && InitArray.value[colIndex].content === value)
      return true;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const boxIndex = (boxRow + r) * 9 + (boxCol + c);
      if (boxIndex !== index && InitArray.value[boxIndex].content === value)
        return true;
    }
  }
  return false;
}

const isPause = ref(false);
function togglePause() {
  if (isGameOver.value || isSolved.value) return;
  isPause.value = !isPause.value;
  isTimer.value = !isPause.value;
}

const isMenu = ref(true);
function startNewGame(level: any) {
  difficulty.value = level;
  isMenu.value = false;
  newGame();
}

function resumeGame() {
  isMenu.value = false;
  showRecords.value = false;
}

function exitGame() {
  if (isGameOver.value || isSolved.value) {
    confirmExit();
    return;
  }

  isExitConfirm.value = true;
}

function confirmExit() {
  isExitConfirm.value = false;
  isMenu.value = true;
  isPause.value = false;
  isGameOver.value = false;
  isSolved.value = false;
  showRecords.value = false;
}

function cancelExit() {
  isExitConfirm.value = false;
}

function saveRecord(time: string) {
  let records = JSON.parse(localStorage.getItem("records") || "[]");

  records.push(time);

  // sort tăng dần
  records.sort((a: string, b: string) => {
    return convertToSeconds(a) - convertToSeconds(b);
  });

  // chỉ lấy top 3
  records = records.slice(0, 3);

  localStorage.setItem("records", JSON.stringify(records));
}

function convertToSeconds(time: string) {
  const [h, m, s] = time.split(":").map(Number);
  return h * 3600 + m * 60 + s;
}
</script>

<template>
  <MainMenu
    v-if="isMenu && !showRecords"
    @newGame="startNewGame"
    @resumeGame="resumeGame"
    @showRecords="showRecords = true"
  />

  <Records v-else-if="showRecords" @close="showRecords = false" />

  <div v-else class="container">
    <Header @new-game="newGame()" />

    <div class="innercontainer">
      <section class="game">
        <div class="game__stats-bar">
          <span class="mistake-text"
            >Mistakes:
            <span :class="{ 'text-danger': mistakes > 0 }"
              >{{ mistakes }}/5</span
            ></span
          >
        </div>

        <table
          class="game__board"
          :class="{ 'blur-effect': isPause || isGameOver }"
        >
          <tbody>
            <tr v-for="row in numbers" :key="row" class="game__row">
              <td
                v-for="column in numbers"
                :key="column - 1 + 9 * (row - 1)"
                class="game__cell"
                :class="[
                  InitArray[column - 1 + 9 * (row - 1)].content !== '0' &&
                  InitArray[column - 1 + 9 * (row - 1)].content !== ''
                    ? 'game__cell--filled'
                    : '',
                  clickIndex === column - 1 + 9 * (row - 1)
                    ? 'game__cell--highlightselected'
                    : '',
                  isSameRowOrColumn(column - 1 + 9 * (row - 1))
                    ? 'game__cell--highlight'
                    : '',
                  isDuplicate(column - 1 + 9 * (row - 1))
                    ? 'game__cell--duplicate'
                    : '',
                ]"
                @click="gameClick(column - 1 + 9 * (row - 1))"
              >
                {{
                  InitArray[column - 1 + 9 * (row - 1)].content === "0"
                    ? ""
                    : InitArray[column - 1 + 9 * (row - 1)].content
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="status">
        <Difficulty v-model="difficulty" />
        <Timer
          :status="isTimer"
          :time="gameTime"
          @update:time="gameTime = $event"
        />

        <div class="status__numbers">
          <div
            v-for="(number, index) in numbers"
            :key="index"
            @click="numberClick(number)"
            class="status__number"
          >
            {{ number }}
          </div>
        </div>

        <div class="status__actions">
          <Action action="erase" @action-click="erase()" />
          <Action action="hint" @action-click="hint()" />
          <Action
            :action="isPause ? 'resume' : 'pause'"
            @action-click="togglePause()"
          />
          <Action action="exit" @action-click="exitGame()" />
        </div>
      </section>
    </div>

    <div v-if="isPause" class="pause-overlay" @click="togglePause">
      <h2>Game Paused</h2>
      <p>Click anywhere to resume</p>
    </div>

    <div
      @click="onClickOverlay()"
      :class="[isSolved ? 'overlay overlay--visible' : 'overlay']"
    >
      <h2 class="overlay__text">
        You <span class="overlay__textspan1">solved</span>
        <span class="overlay__textspan2">it!</span>
      </h2>
    </div>

    <div v-if="isGameOver" class="gameover-overlay">
      <div class="gameover-box">
        <h2>GAME OVER</h2>
        <p>You made 5 mistakes and lost this game</p>
        <div class="gameover-actions">
          <button class="btn-newgame" @click="newGame">New Game</button>
          <button class="btn-exit" @click="exitGame">Exit</button>
        </div>
      </div>
    </div>

    <div v-if="isExitConfirm" class="gameover-overlay">
      <div class="gameover-box">
        <h2>Exit Game?</h2>
        <p>Do you really want to exit?</p>

        <div class="gameover-actions">
          <button class="btn-exit" @click="cancelExit">NO</button>
          <button class="btn-newgame" @click="confirmExit">YES</button>
        </div>
      </div>
    </div>
  </div>

  <Footer />
</template>

<style>
/* Mistakes */
.game__stats-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1px;
  padding-left: 2px;
}

.mistake-text {
  font-weight: 600;
  font-size: 16px;
  color: var(--color-grey);
  display: inline-block;
  transform: translateY(30px);
}

.text-danger {
  color: #e74c3c;
}

.blur-effect {
  filter: blur(4px);
  pointer-events: none;
}

/* GAME OVER + EXIT */
.gameover-overlay {
  position: fixed;
  inset: 0; /* thay cho top, left, width, height */
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.gameover-box {
  background: white;
  padding: 40px 60px;
  border-radius: 24px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
}

.gameover-box h2 {
  color: #e74c3c;
  font-size: 32px;
  margin-bottom: 10px;
  font-family: "Montserrat", sans-serif;
}

.gameover-box p {
  color: var(--color-grey-light);
  margin-bottom: 30px;
}

.gameover-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.gameover-actions button {
  padding: 12px 25px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.gameover-actions button:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* Buttons */
.btn-newgame {
  background: var(--color-blue);
  color: white;
}

.btn-exit {
  background: var(--color-grey-lighter);
  color: var(--color-grey);
}

/* SUDOKU BOARD */
.game__board {
  border-collapse: collapse;
  margin: auto;
}

.game__cell {
  width: 50px;
  height: 50px;
  border: 1px solid gray;
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  cursor: pointer;
}

/* Highlight states */
.game__cell--highlight {
  background: #d5edf6;
}

.game__cell--highlightselected {
  background: #098d52;
  color: white !important;
}

.game__cell--duplicate {
  background: #ffb3b3;
  color: #b30000;
}

.game__cell--filled {
  color: var(--color-grey);
}

/* Grid borders */
.game__cell:nth-child(3n) {
  border-right: 3px solid black;
}

.game__row:nth-child(3n) .game__cell {
  border-bottom: 3px solid black;
}

.game__cell:first-child {
  border-left: 3px solid black;
}

.game__row:first-child .game__cell {
  border-top: 3px solid black;
}

/* PAUSE */
.pause-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  z-index: 100;
  cursor: pointer;
}
</style>
