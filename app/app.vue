<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ToastAlert />
</template>
<script setup>
import "@morev/vue-transitions/styles";

useHead({
  titleTemplate: "%s - Personal Events"
});
</script>
<style>
a {
  text-decoration: none;
  color: inherit;
}
body {
  margin: 0;
}
.fc-list-day-side-text {
  float: left !important;
  margin-left: 5px;
}

.color-indicator {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.disabled-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 2;

  border-radius: 0.25rem;
}
.user-select-none {
  * {
    user-select: none !important;
    pointer-events: none !important;
  }
}

.googleAuth-btn {
  background-color: transparent;
  color: #333333;
  border: solid 1px #4285f4;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  gap: 10px;
  font-weight: 600;
  transition: all 0.3s ease;

  Icon {
    margin-right: 10px;
    font-size: 20px;
  }

  &:hover {
    transition: all 0.3s ease;
    color: #424242;
    background-color: #4286f446;
  }
}
</style>
