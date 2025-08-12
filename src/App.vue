<template>
  <div>
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

import "./main.css";

export default {
  components: { NavBar },
};
</script>
