<script setup lang="ts">
defineProps<{ action: string }>();
</script>

<template>
  <!-- ERASE -->
  <svg v-if="action === 'erase'" class="status__action-svg" viewBox="0 0 24 24">
    <line
      x1="5"
      y1="5"
      x2="19"
      y2="19"
      stroke="hsl(213,30%,59%)"
      stroke-width="2"
    />
    <line
      x1="19"
      y1="5"
      x2="5"
      y2="19"
      stroke="hsl(213,30%,59%)"
      stroke-width="2"
    />
  </svg>

  <!-- HINT -->
  <svg
    v-else-if="action === 'hint'"
    class="status__action-svg"
    viewBox="0 0 24 24"
  >
    <circle
      cx="12"
      cy="10"
      r="5"
      stroke="hsl(213,30%,59%)"
      stroke-width="2"
      fill="none"
    />
    <rect x="9" y="15" width="6" height="3" fill="hsl(213,30%,59%)" />
  </svg>

  <!-- PAUSE -->
  <svg
    v-else-if="action === 'pause'"
    class="status__action-svg"
    viewBox="0 0 24 24"
  >
    <rect x="6" y="4" width="4" height="16" fill="hsl(213,30%,59%)" />
    <rect x="14" y="4" width="4" height="16" fill="hsl(213,30%,59%)" />
  </svg>

  <!-- EXIT -->
  <svg
    v-else-if="action === 'exit'"
    class="status__action-svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M16 17l5-5-5-5M21 12H9"
      stroke="hsl(213,30%,59%)"
      stroke-width="2"
      fill="none"
    />
    <rect
      x="3"
      y="4"
      width="6"
      height="16"
      stroke="hsl(213,30%,59%)"
      stroke-width="2"
      fill="none"
    />
  </svg>
</template>

<style>
.status__action-svg {
  display: block;
}
</style>
