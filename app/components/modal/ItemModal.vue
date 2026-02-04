<template>
  <TransitionFade>
    <div v-if="isOpen">
      <div class="custom-modal-backdrop"></div>
      <div class="custom-modal">
        <div class="custom-modal-header">
          <span>{{ title }}</span>
          <div class="close-btn">
            <Icon
              name="mdi:close"
              @click="$emit('close')"
              style="cursor: pointer"
            />
          </div>
        </div>
        <div class="custom-modal-body">
          <slot />
        </div>
      </div>
    </div>
  </TransitionFade>
</template>

<script setup lang="ts">
import { TransitionFade } from "@morev/vue-transitions";
const props = defineProps<{
  isOpen: boolean;
  title: string;
}>();
</script>

<style lang="scss" scoped>
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}
.custom-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  width: 600px;
  max-width: 90%;
}
.custom-modal-header {
  background-color: #f5f5f5;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-modal-body {
  padding: 16px;
}
</style>
