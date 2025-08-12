<template>
  <form @submit.prevent="login">
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" required />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Login</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>

<script>
import { inject, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default {
  setup() {
    const auth = inject("authStore");
    const router = useRouter();
    const username = ref("");
    const password = ref("");
    const error = ref(null);

    async function login() {
      console.log("Login started");
      try {
        const res = await api.post("/api/login/", {
          username: username.value,
          password: password.value,
        });
        console.log("Login response:", res.data);

        const accessToken = res.data.access;
        if (!accessToken) {
          throw new Error("Invalid credentials");
        }

        auth.setToken(accessToken);

        const userData = parseJwt(accessToken);
        if (userData) {
          auth.setUser({
            username: userData.username,
            role: userData.role,
          });
        } else {
          auth.setUser(null);
        }

        error.value = null;
        router.push("/home");
      } catch (e) {
        console.log("Login error:", e);
        error.value = "Invalid credentials";
      }
    }

    return { username, password, login, error };
  },
};
</script>
