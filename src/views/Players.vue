<template>
  <div>
    <h1>Players</h1>

    <div v-if="auth.isAdmin()">
      <h2>{{ editingPlayer ? "Edit Player" : "Add Player" }}</h2>
      <form @submit.prevent="savePlayer">
        <label for="shirt_number">Shirt Number</label><br />
        <input
          id="shirt_number"
          v-model="form.shirt_number"
          type="number"
          placeholder="Shirt Number"
          required
        /><br />

        <label for="first_name">First Name</label><br />
        <input
          id="first_name"
          v-model="form.first_name"
          placeholder="First Name"
          required
        /><br />

        <label for="last_name">Last Name</label><br />
        <input
          id="last_name"
          v-model="form.last_name"
          placeholder="Last Name"
          required
        /><br />

        <label for="position">Position</label><br />
        <select id="position" v-model="form.position" required>
          <option disabled value="">Select Position</option>
          <option value="GK">Goalkeeper</option>
          <option value="DF">Defender</option>
          <option value="MF">Midfielder</option>
          <option value="FW">Forward</option></select
        ><br /><br />

        <button type="submit">{{ editingPlayer ? "Update" : "Add" }}</button>
        <button type="button" v-if="editingPlayer" @click="cancelEdit">
          Cancel
        </button>
      </form>
    </div>

    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>
          <th>Shirt Number</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Position</th>
          <th>Goals</th>
          <th v-if="auth.isAdmin()">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="player in players" :key="player.id">
          <td>{{ player.shirt_number }}</td>
          <td>{{ player.first_name }}</td>
          <td>{{ player.last_name }}</td>
          <td>{{ player.position }}</td>
          <td>{{ player.goals }}</td>
          <td v-if="auth.isAdmin()">
            <button @click="editPlayer(player)">Edit</button>
            <button @click="deletePlayer(player.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<script>
import { inject, ref, onMounted } from "vue";
import api from "../api";

export default {
  name: "Players",
  setup() {
    const auth = inject("authStore");
    const players = ref([]);
    const error = ref(null);

    const form = ref({
      shirt_number: "",
      first_name: "",
      last_name: "",
      position: "",
    });
    const editingPlayer = ref(null);

    async function fetchPlayers() {
      try {
        const res = await api.get("/api/manutd/players/", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        players.value = res.data.sort(
          (a, b) => a.shirt_number - b.shirt_number
        );
      } catch (e) {
        error.value = "Failed to fetch players";
        console.error(e);
      }
    }

    async function savePlayer() {
      try {
        if (editingPlayer.value) {
          await api.put(
            `/api/manutd/players/${editingPlayer.value.id}/`,
            form.value,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
        } else {
          await api.post("/api/manutd/players/", form.value, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
        }
        form.value = {
          shirt_number: "",
          first_name: "",
          last_name: "",
          position: "",
        };
        editingPlayer.value = null;
        await fetchPlayers();
      } catch (e) {
        error.value = "Failed to save player";
        console.error(e);
      }
    }

    function editPlayer(player) {
      editingPlayer.value = player;
      form.value = {
        shirt_number: player.shirt_number,
        first_name: player.first_name,
        last_name: player.last_name,
        position: player.position,
      };
    }

    function cancelEdit() {
      editingPlayer.value = null;
      form.value = {
        shirt_number: "",
        first_name: "",
        last_name: "",
        position: "",
      };
      error.value = null;
    }

    async function deletePlayer(id) {
      if (!confirm("Are you sure you want to delete this player?")) return;
      try {
        await api.delete(`/api/manutd/players/${id}/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        await fetchPlayers();
      } catch (e) {
        error.value = "Failed to delete player";
        console.error(e);
      }
    }

    onMounted(fetchPlayers);

    return {
      auth,
      players,
      error,
      form,
      editingPlayer,
      savePlayer,
      editPlayer,
      cancelEdit,
      deletePlayer,
    };
  },
};
</script>
