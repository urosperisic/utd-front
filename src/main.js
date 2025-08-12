import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { useAuth } from "./stores/authStore";

const app = createApp(App);

const auth = useAuth();

app.provide("authStore", auth);

app.use(router);
app.mount("#app");
