<template>
  <div>
    <h1>Profile</h1>
    <p>Username: {{ auth.user?.username }}</p>
    <p>Role: {{ auth.user?.role }}</p>
  </div>
</template>

<script>
import { inject } from "vue";

export default {
  name: "Profile",
  setup() {
    const auth = inject("authStore");
    return { auth };
  },
};
</script>
