<template>
  <nav>
    <router-link
      v-if="!auth.isAuthenticated()"
      to="/login"
      class="nav-link"
      active-class="active-link"
    >
      Login
    </router-link>

    <router-link
      v-if="!auth.isAuthenticated()"
      to="/signup"
      class="nav-link"
      active-class="active-link"
    >
      Signup
    </router-link>

    <template v-if="auth.isAuthenticated()">
      <router-link to="/home" class="nav-link" active-class="active-link"
        >Home</router-link
      >
      <router-link to="/players" class="nav-link" active-class="active-link"
        >Players</router-link
      >
      <router-link to="/matches" class="nav-link" active-class="active-link"
        >Matches</router-link
      >
      <router-link to="/profile" class="nav-link" active-class="active-link"
        >Profile</router-link
      >
      <router-link
        v-if="auth.isAdmin()"
        to="/users"
        class="nav-link"
        active-class="active-link"
      >
        Manage
      </router-link>
      <a href="#" @click.prevent="logout" class="nav-link">Logout</a>
    </template>
  </nav>
</template>

<script>
import { useAuth } from "../stores/authStore";
import { useRouter } from "vue-router";

export default {
  setup() {
    const auth = useAuth();
    const router = useRouter();

    function logout() {
      auth.clear();
      router.push("/login");
    }

    return { auth, logout };
  },
};
</script>
