<template>
  <div>
    <h1>Matches</h1>

    <div v-if="auth.isAdmin()">
      <h2>{{ editingMatch ? "Edit Match" : "Add Match" }}</h2>
      <form @submit.prevent="saveMatch">
        <label for="opponent">Opponent:</label><br />
        <select id="opponent" v-model="form.opponent" required>
          <option disabled value="">Select opponent</option>
          <option v-for="team in teams" :key="team" :value="team">
            {{ team }}
          </option>
        </select>
        <br /><br />

        <label for="is_home">Home or Away:</label><br />
        <select id="is_home" v-model="form.is_home" required>
          <option disabled value="">Select home/away</option>
          <option value="H">Home</option>
          <option value="A">Away</option>
        </select>
        <br /><br />

        <label for="result">Result:</label><br />
        <input
          id="result"
          v-model="form.result"
          placeholder="e.g. 2:1"
          required
        />
        <br /><br />

        <label for="match_date">Match Date:</label><br />
        <input id="match_date" type="date" v-model="form.match_date" required />
        <br /><br />

        <fieldset>
          <legend>Scorers (last name and count):</legend>
          <div
            v-for="(scorer, index) in form.scorers"
            :key="index"
            style="margin-bottom: 10px"
          >
            <label :for="'scorer_last_name_' + index">Last Name:</label>
            <input
              :id="'scorer_last_name_' + index"
              v-model="scorer.last_name"
              placeholder="Last Name"
              required
              style="width: 150px"
            />

            <label :for="'scorer_count_' + index">Goals:</label>
            <input
              :id="'scorer_count_' + index"
              v-model.number="scorer.count"
              type="number"
              min="1"
              placeholder="Goals"
              required
              style="width: 70px"
            />
            <button type="button" @click="removeScorer(index)">Remove</button>
          </div>
          <button
            type="button"
            @click="addScorer"
            class="add-scorer-btn"
            aria-label="Add scorer"
            title="Add scorer"
          >
            <i class="fa-solid fa-plus"></i>
          </button>
        </fieldset>
        <br />

        <button type="submit">{{ editingMatch ? "Update" : "Add" }}</button>
        <button type="button" v-if="editingMatch" @click="cancelEdit">
          Cancel
        </button>
      </form>
    </div>

    <table border="1" cellpadding="5" cellspacing="0" style="margin-top: 20px">
      <thead>
        <tr>
          <th>Date</th>
          <th>Opp</th>
          <th>H/A</th>
          <th>Result</th>
          <th>Scorrers</th>
          <th v-if="auth.isAdmin()">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="match in matches" :key="match.id">
          <td>{{ match.match_date }}</td>
          <td>{{ match.opponent }}</td>
          <td>{{ match.is_home === "H" ? "Home" : "Away" }}</td>
          <td>{{ match.result }}</td>
          <td>
            <ul>
              <li v-for="goal in match.goals" :key="goal.player_name">
                {{ goal.player_name }} x{{ goal.count }}
              </li>
            </ul>
          </td>
          <td v-if="auth.isAdmin()">
            <button @click="editMatch(match)">Edit</button>
            <button @click="deleteMatch(match.id)">Delete</button>
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
  name: "Matches",
  setup() {
    const auth = inject("authStore");
    const matches = ref([]);
    const error = ref(null);

    const teams = [
      "Arsenal",
      "Aston Villa",
      "Bournemouth",
      "Brentford",
      "Brighton",
      "Chelsea",
      "Crystal Palace",
      "Everton",
      "Fulham",
      "Liverpool",
      "Luton",
      "Man City",
      "Man Utd",
      "Newcastle",
      "Nottingham Forest",
      "Sheffield United",
      "Southampton",
      "Tottenham",
      "West Ham",
      "Wolves",
    ];

    const form = ref({
      opponent: "",
      is_home: "",
      result: "",
      match_date: "",
      scorers: [],
    });

    const editingMatch = ref(null);

    async function fetchMatches() {
      try {
        const res = await api.get("/api/manutd/matches/", {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        matches.value = res.data;
      } catch (e) {
        error.value = "Failed to fetch matches";
        console.error(e);
      }
    }

    function addScorer() {
      form.value.scorers.push({ last_name: "", count: 1 });
    }

    function removeScorer(index) {
      form.value.scorers.splice(index, 1);
    }

    async function saveMatch() {
      try {
        // Basic validation: scorers must have last_name and count > 0
        form.value.scorers = form.value.scorers.filter(
          (s) => s.last_name.trim() !== "" && s.count > 0
        );

        if (editingMatch.value) {
          // Update existing
          await api.put(
            `/api/manutd/matches/${editingMatch.value.id}/`,
            form.value,
            {
              headers: { Authorization: `Bearer ${auth.token}` },
            }
          );
        } else {
          // Create new
          await api.post("/api/manutd/matches/", form.value, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
        }
        resetForm();
        await fetchMatches();
      } catch (e) {
        error.value = "Failed to save match";
        console.error(e);
      }
    }

    function editMatch(match) {
      editingMatch.value = match;
      // Deep copy + add scorers as empty array (no direct write access to goals)
      form.value = {
        opponent: match.opponent,
        is_home: match.is_home,
        result: match.result,
        match_date: match.match_date,
        scorers: [],
      };
    }

    function cancelEdit() {
      resetForm();
      error.value = null;
    }

    function resetForm() {
      editingMatch.value = null;
      form.value = {
        opponent: "",
        is_home: "",
        result: "",
        match_date: "",
        scorers: [],
      };
      error.value = null;
    }

    async function deleteMatch(id) {
      if (!confirm("Are you sure you want to delete this match?")) return;
      try {
        await api.delete(`/api/manutd/matches/${id}/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        await fetchMatches();
      } catch (e) {
        error.value = "Failed to delete match";
        console.error(e);
      }
    }

    onMounted(fetchMatches);

    return {
      auth,
      matches,
      error,
      form,
      editingMatch,
      teams,
      addScorer,
      removeScorer,
      saveMatch,
      editMatch,
      cancelEdit,
      deleteMatch,
    };
  },
};
</script>
