import { reactive } from "vue";

const auth = reactive({
  token: localStorage.getItem("token") || null,
  user: (() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  })(),

  setToken(token) {
    this.token = token;
    localStorage.setItem("token", token);
  },

  setUser(user) {
    this.user = user;
    localStorage.setItem("user", JSON.stringify(user));
  },

  clear() {
    this.token = null;
    this.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isAuthenticated() {
    return !!this.token;
  },

  isAdmin() {
    return this.user?.role === "admin";
  },
});

export function useAuth() {
  return auth;
}
