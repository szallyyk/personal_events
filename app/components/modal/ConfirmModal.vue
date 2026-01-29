<template>
  <div class="custom-modal-backdrop"></div>
  <div class="custom-modal">
    <div class="custom-modal-header">
      <span>Opravdu chcete smazat tuto událost?</span>
      <div class="close-btn">
        <Icon
          name="mdi:close"
          @click="$emit('close')"
          style="cursor: pointer"
        />
      </div>
    </div>
    <div class="custom-modal-body">
      <div class="d-flex justify-content-between">
        <button class="btn btn-secondary me-2" @click="$emit('close')">
          Zrušit
        </button>
        <button class="btn btn-danger" @click="$emit('confirm')">Smazat</button>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss">
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
  width: 400px;
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
