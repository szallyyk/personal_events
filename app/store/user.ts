import { defineStore } from "pinia";

interface User {
    bearerToken: string;
    id: number;
}

export const useUserStore = defineStore("useUserStore", {
    state: () => ({
        user: null as User | null,
    }),
    persist: true,
    actions: {
        setUser(userData: User) {
            this.user = userData;
        },
        clearUser() {
            this.user = null;
        }
    }
});
