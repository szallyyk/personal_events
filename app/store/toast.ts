import { defineStore } from "pinia";
import { ref } from "vue";
export const useToastStore = defineStore("toastStore", () => {
    const toastMessage = ref<string | undefined>(undefined);
    const toastType = ref<string | undefined>(undefined);
    const toastDate = ref<Date | undefined>(undefined);
    const isVerified = ref<boolean>(false);
    const alert = (message: string, type: string = "success") => {
        toastMessage.value = message;
        (toastType.value = type), (toastDate.value = new Date());
    };
    function verifyUser() {
        isVerified.value = true;
    }
    return {
        verifyUser,
        isVerified,
        alert,
        toastMessage,
        toastType,
        toastDate,
    };
});
