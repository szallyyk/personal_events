<script setup lang="ts">
import { toast } from "vue3-toastify";
import { useToastStore } from "~/store/toast";
import { storeToRefs } from "pinia";
import "vue3-toastify/dist/index.css";

const toastStore = useToastStore();
const { toastMessage, toastType, toastDate } = storeToRefs(toastStore);
const showToast = () => {
  if (toastMessage.value && toastType.value) {
    switch (toastType.value) {
      case "error":
        toast.error(toastMessage.value, {
          autoClose: 3000,
          position: "top-center",
          theme: "colored",
        });
        break;
      case "info":
        toast.info(toastMessage.value, {
          autoClose: 3000,
          position: "top-center",
          theme: "colored",
        });
        break;
      case "warning":
        toast.warning(toastMessage.value, {
          autoClose: 3000,
          position: "top-center",
          theme: "colored",
        });
        break;
      default:
        toast.success(toastMessage.value, {
          autoClose: 3000,
          position: "top-center",
          theme: "colored",
        });
    }
  }
};

watch(
  () => toastDate.value,
  (newDate, oldDate) => {
    setTimeout(() => {
      showToast();
    }, 100);
  },
);
</script>

<template>
  <div></div>
</template>
