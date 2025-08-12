<template>
  <nav>
    <a
      v-if="!auth.isAuthenticated()"
      href="#"
      @click.prevent="$router.push('/login')"
      >Login</a
    >
    <a
      v-if="!auth.isAuthenticated()"
      href="#"
      @click.prevent="$router.push('/signup')"
      >Signup</a
    >

    <template v-if="auth.isAuthenticated()">
      <a href="#" @click.prevent="$router.push('/home')">Home</a>
      <a href="#" @click.prevent="$router.push('/players')">Players</a>
      <a href="#" @click.prevent="$router.push('/matches')">Matches</a>
      <a href="#" @click.prevent="$router.push('/profile')">Profile</a>
      <a
        v-if="auth.isAuthenticated() && auth.isAdmin()"
        href="#"
        @click.prevent="$router.push('/users')"
        >Manage Users</a
      >
      <a href="#" @click.prevent="logout">Logout</a>
    </template>
  </nav>
</template>

<script>
import { useAuth } from "../stores/authStore";

export default {
  setup() {
    const auth = useAuth();

    function logout() {
      auth.clear();
      window.location.href = "/login";
    }

    return { auth, logout };
  },
};
</script>

<style scoped></style>
