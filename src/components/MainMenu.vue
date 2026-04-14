<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits(["newGame", "resumeGame", "showRecords"]);

const showDifficulty = ref(false);

const handleNewGameClick = () => {
  showDifficulty.value = true;
};

const selectDifficulty = (level: string) => {
  emit("newGame", level);
  showDifficulty.value = false;
};

const goBack = () => {
  showDifficulty.value = false;
};
</script>

<template>
  <div class="mainmenu">
    <div class="background-decor">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <div class="mainmenu__content">
      <div v-if="!showDifficulty" class="menu-step">
        <h1 class="mainmenu__title">
          <span class="letter">S</span>
          <span class="letter">U</span>
          <span class="letter">D</span>
          <span class="letter">O</span>
          <span class="letter">K</span>
          <span class="letter">U</span>
        </h1>

        <div class="mainmenu__buttons">
          <button
            class="mainmenu__btn btn--primary"
            @click="handleNewGameClick"
          >
            <span class="btn__text">NEW GAME</span>
            <div class="btn__bg"></div>
          </button>

          <button
            class="mainmenu__btn btn--secondary"
            @click="emit('resumeGame')"
          >
            <span class="btn__text">RESUME GAME</span>
            <div class="btn__bg"></div>
          </button>

          <button
            class="mainmenu__btn btn--secondary"
            @click="emit('showRecords')"
          >
            <span class="btn__text">RECORDS</span>
            <div class="btn__bg"></div>
          </button>
        </div>
      </div>

      <div v-else class="menu-step">
        <h2 class="difficulty__title">SELECT DIFFICULTY</h2>

        <div class="mainmenu__buttons">
          <button
            class="mainmenu__btn btn--difficulty"
            @click="selectDifficulty('Easy')"
          >
            <span class="btn__text">EASY</span>
            <div class="btn__bg"></div>
          </button>

          <button
            class="mainmenu__btn btn--difficulty"
            @click="selectDifficulty('Medium')"
          >
            <span class="btn__text">MEDIUM</span>
            <div class="btn__bg"></div>
          </button>

          <button
            class="mainmenu__btn btn--difficulty"
            @click="selectDifficulty('Hard')"
          >
            <span class="btn__text">HARD</span>
            <div class="btn__bg"></div>
          </button>

          <button class="btn--back" @click="goBack">← Back to Menu</button>
        </div>
      </div>

      <p class="mainmenu__footer">© Sudoku</p>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Poppins:wght@400;600&display=swap");

.mainmenu {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color, #fff);
  overflow: hidden;
  position: relative;
  font-family: "Source Sans Pro", sans-serif;
}

/* Background Decor */
.background-decor .circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}
.circle-1 {
  width: 300px;
  height: 300px;
  background: hsla(210, 88%, 56%, 0.15);
  top: 10%;
  left: 20%;
}
.circle-2 {
  width: 400px;
  height: 400px;
  background: hsla(34, 26%, 89%, 0.5);
  bottom: 10%;
  right: 15%;
}

.mainmenu__content {
  position: relative;
  z-index: 1;
  text-align: center;
  background: rgba(255, 255, 255, 0.85);
  padding: 60px 80px;
  border-radius: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-grey-lighter);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  min-width: 420px;
}

.mainmenu__title {
  font-family: "Montserrat", sans-serif;
  font-size: 72px;
  letter-spacing: 8px;
  color: var(--color-grey);
  margin-bottom: 40px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.mainmenu__title .letter {
  display: inline-block;
  text-shadow: 2px 4px 10px rgba(56, 189, 248, 0.2);
  animation: float 3s ease-in-out infinite;
}

.mainmenu__title .letter:first-child {
  color: var(--color-blue);
}

.difficulty__title {
  font-family: "Montserrat", sans-serif;
  font-size: 28px;
  color: var(--color-grey);
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.mainmenu__buttons {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mainmenu__btn {
  position: relative;
  padding: 16px 50px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn__text {
  position: relative;
  z-index: 2;
}

.btn__bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  z-index: 1;
}

/* Nút NEW GAME */
.btn--primary {
  color: white;
}
.btn--primary .btn__bg {
  background: var(--color-blue);
}
.btn--primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(56, 189, 248, 0.3);
}

/* Nút RESUME */
.btn--secondary {
  border: 2px solid var(--color-grey-lighter);
  color: var(--color-grey);
}
.btn--secondary:hover {
  background: var(--color-orange);
  border-color: var(--color-orange-dark);
  transform: translateY(-3px);
}

/* Nút chọn độ khó */
.btn--difficulty {
  border: 2px solid var(--color-blue);
  color: var(--color-blue);
}
.btn--difficulty:hover {
  background: var(--color-blue);
  color: white;
  transform: translateY(-3px);
}

.btn--back {
  background: none;
  border: none;
  color: var(--color-grey-light);
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
  font-weight: 600;
}
.btn--back:hover {
  color: var(--color-blue);
  text-decoration: underline;
}

.mainmenu__footer {
  margin-top: 40px;
  font-size: 12px;
  color: var(--color-grey-light);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 480px) {
  .mainmenu__content {
    padding: 40px 20px;
    min-width: 90%;
  }
  .mainmenu__title {
    font-size: 40px;
  }
}
</style>
