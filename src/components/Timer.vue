<script setup lang="ts">
import { ref, watch, onUnmounted } from "vue";

const props = defineProps<{ status: boolean; time: string }>();
const emit = defineEmits(["update:time"]);

const second = ref(0);
const minute = ref(0);
const hour = ref(0);
const timer = ref("00:00:00");

let interval: any = null;

// parse time từ Game.vue
function setTimeFromString(timeStr: string) {
  const [h, m, s] = timeStr.split(":").map(Number);
  hour.value = h;
  minute.value = m;
  second.value = s;
  timer.value = timeStr;
}

// update string
function updateTimer() {
  const s = second.value < 10 ? "0" + second.value : second.value;
  const m = minute.value < 10 ? "0" + minute.value : minute.value;
  const h = hour.value < 10 ? "0" + hour.value : hour.value;

  timer.value = `${h}:${m}:${s}`;
  emit("update:time", timer.value); // gửi ngược lên Game.vue
}

// nhận time từ ngoài
watch(
  () => props.time,
  (val) => {
    setTimeFromString(val);
  },
  { immediate: true },
);

watch(
  () => props.status,
  (val) => {
    if (val) {
      if (interval) clearInterval(interval);

      interval = setInterval(() => {
        second.value++;

        if (second.value === 60) {
          second.value = 0;
          minute.value++;

          if (minute.value === 60) {
            minute.value = 0;
            hour.value++;
          }
        }

        updateTimer();
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<template>
  <div class="status__time">
    {{ timer }}
  </div>
</template>
