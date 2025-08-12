<template>
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";

import "./main.css";

export default {
  components: { NavBar },
};
</script>
