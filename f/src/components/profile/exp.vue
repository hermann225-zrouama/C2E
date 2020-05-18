<template>
  <v-card dark>
    <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
      <strong>{{res.msg}}</strong>
    </v-alert>
    <div v-else class="font-weight-light title text-center">Ajouter une experience</div>
    <v-divider></v-divider>
    <div class="pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="exp_data.company"
          :rules="Rules"
          label="compagnie ou institution"
          required
        ></v-text-field>

        <v-text-field
          v-model="exp_data.debut"
          required
          :rules="Rules"
          label="debut (format mois année)"
        />
        <v-text-field
          v-model="exp_data.fin"
          required
          :rules="Rules"
          label="fin (format mois année)"
        />
        <v-text-field v-model="exp_data.job" required :rules="Rules" label="job (role joué)" />
        <v-text-field v-model="exp_data.description" required :rules="Rules" label="description" />

        <v-btn v-if="valid" color="blue" class="mt-4 mr-4" @click="validate()">Valider</v-btn>
        <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
      </v-form>
    </div>
  </v-card>
</template>
<script>
import crud from "@/services/crud/crud";
import { store } from "../../store/store";

export default {
  store,
  data: () => ({
    progress: false,
    res: "",
    exp_data: {
      company: "",
      debut: "",
      fin: "",
      job: "",
      description: ""
    },
    valid: true,
    Rules: [v => !!v || "champ requis"]
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
      this.exp();
    },
    clear() {
      this.$refs.form.reset();
    },
    exp() {
      this.progress = true;
      if (
        this.exp_data.company != "" &&
        this.exp_data.debut != "" &&
        this.exp_data.fin &&
        this.exp_data.job &&
        this.exp_data.description
      ) {
        var data = {
          company: this.exp_data.company,
          debut: this.exp_data.debut,
          fin: this.exp_data.fin,
          job: this.exp_data.job,
          description: this.exp_data.description,
          id: localStorage.getItem("id")
        };
        crud.save_exp(data).then(data => {
          this.res = data.data;
          this.progress = false;
          this.clear();
        });
      } else {
        this.$refs.form.validate();
      }
    },
    stored(val) {
      this.$store.commit("exp", val.exp_data);
    }
  },
  watch: {
    res: function(val) {
      val.type == "success" ? this.stored(val) : null;
    }
  }
};
</script>

