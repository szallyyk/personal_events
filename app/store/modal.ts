import { defineStore } from "pinia";
export const useModalStore = defineStore("useModalStore", {
    state: () => ({
        confirmModalVisible: false,
        confirmRegularityModalVisible: false,
        itemModalVisible: false,
    }),
    actions: {
    }
});
