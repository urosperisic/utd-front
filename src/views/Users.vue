<template>
  <div>
    <h1>All Users</h1>
    <table border="1" cellpadding="5">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button
              @click="deleteUser(user.id)"
              :disabled="user.role === 'admin'"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script>
import axios from "axios";
import { inject, ref, onMounted } from "vue";
import api from "../api";

export default {
  name: "Users",
  setup() {
    const auth = inject("authStore");
    const users = ref([]);
    const error = ref(null);

    async function fetchUsers() {
      try {
        const res = await api.get("/api/users/", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        users.value = res.data;
      } catch (e) {
        error.value = "Failed to fetch users";
      }
    }

    async function deleteUser(id) {
      if (!confirm("Are you sure you want to delete this user?")) return;

      try {
        await api.delete(`/api/delete/${id}/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        users.value = users.value.filter((u) => u.id !== id);
      } catch (e) {
        error.value = "Failed to delete user";
      }
    }

    onMounted(fetchUsers);

    return { users, error, deleteUser };
  },
};
</script>
