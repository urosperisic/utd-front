<template>
  <form @submit.prevent="signup">
    <h2>Signup</h2>
    <input v-model="username" placeholder="Username" required />
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" required />
    <button type="submit">Signup</button>
    <p v-if="error" style="color: red">{{ error }}</p>
    <p v-if="success" style="color: green">Account created! Please login.</p>
  </form>
</template>

<script>
import { ref } from "vue";
import api from "../api";

export default {
  setup() {
    const username = ref("");
    const email = ref("");
    const password = ref("");
    const error = ref(null);
    const success = ref(false);

    async function signup() {
      try {
        await api.post("/api/register/", {
          username: username.value,
          email: email.value,
          password: password.value,
        });
        success.value = true;
        error.value = null;
      } catch (e) {
        error.value = "Signup failed";
        success.value = false;
      }
    }

    return { username, email, password, signup, error, success };
  },
};
</script>
