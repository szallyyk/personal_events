import { defineStore } from "pinia";

interface User {
  bearerToken: string;
  id: number;
  email: string;
}

export const useUserStore = defineStore("useUserStore", {
  state: () => ({
    user: null as User | null
  }),
  persist: true,
  actions: {
    setUser(userData: User) {
      this.user = userData;
    },
    setEmail(email: string) {
      if (this.user) {
        this.user.email = email;
      }
    },
    setBarierToken(token: string) {
      if (this.user) {
        this.user.bearerToken = token;
      }
    },
    clearUser() {
      this.user = null;
    }
  }
});
