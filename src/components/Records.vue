<script setup lang="ts">
import { ref, onMounted } from "vue";

const records = ref<string[]>([]);

onMounted(() => {
  records.value = JSON.parse(localStorage.getItem("records") || "[]");
});
</script>

<template>
  <div class="records">
    <div class="records__content">
      <h2 class="records__title">🏆 TOP 3 RECORDS</h2>

      <div v-if="records.length === 0" class="records__empty">
        No records yet
      </div>

      <div v-else class="records__list">
        <div
          v-for="(time, index) in records"
          :key="index"
          class="records__item"
        >
          #{{ index + 1 }} - {{ time }}
        </div>
      </div>

      <button class="btn--back" @click="$emit('close')">← Back to Menu</button>
    </div>
  </div>
</template>

<style scoped>
.records {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background-color, #fff);
}

.records__content {
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 60px 80px;
  border-radius: 24px;
  border: 1px solid var(--color-grey-lighter);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  min-width: 420px;
}

.records__title {
  font-family: "Montserrat", sans-serif;
  font-size: 28px;
  color: var(--color-grey);
  margin-bottom: 30px;
}

.records__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.records__item {
  padding: 14px;
  border: 2px solid var(--color-blue);
  border-radius: 12px;
  color: var(--color-blue);
  font-weight: 600;
  letter-spacing: 1px;
}

.records__empty {
  color: var(--color-grey-light);
  margin-bottom: 30px;
}

.btn--back {
  background: none;
  border: none;
  color: var(--color-grey-light);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.btn--back:hover {
  color: var(--color-blue);
  text-decoration: underline;
}
</style>
