<script setup lang="ts">
import Svg from "./Svg.vue";

const props = defineProps<{ action: string }>();
const emit = defineEmits(["action-click"]);

const actionMap: Record<string, string> = {
  erase: "Erase",
  hint: "Hint",
  pause: "Pause",
  exit: "Exit",
};

const label = actionMap[props.action] || "";
</script>

<template>
  <div class="status__action" @click="emit('action-click')">
    <Svg :action="action" />
    <p class="status__action-text">{{ label }}</p>
  </div>
</template>

<style scoped>
.status__action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 70px;
  cursor: pointer;
  gap: 2px;
}

.status__action :deep(svg) {
  width: 22px;
  height: 22px;
}

.status__action-text {
  font-size: 13px;
  margin: 0;
  line-height: 1;
}
</style>
