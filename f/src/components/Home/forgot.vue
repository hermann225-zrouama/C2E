<template>
  <div>
    <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
      <strong>{{res.msg}}</strong>
    </v-alert>
    <div v-else class="font-weight-light title text-center">Recuperation de mot de passe</div>

    <v-divider></v-divider>
    <div class="pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="mail" :rules="emailRules" label="E-mail" required></v-text-field>
        <v-btn v-if="valid" color="error" class="mt-4 mr-4" @click="validate()">soumettre</v-btn>
        <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
      </v-form>
    </div>
  </div>
</template>
<script>
import crud from "@/services/crud/crud";

export default {
  name: "forgot",
  data: () => ({
    res: "",
    progress: false,
    mail: "",
    valid: true,
    emailRules: [
      v => !!v || "addresse email requise",
      v => /.+@.+\..+/.test(v) || "l'email n'est pas valide"
    ]
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
      this.submit();
    },
    clear() {
      this.$refs.form.reset();
    },
    submit() {
      this.progress = true;
      if (this.mail != "") {
        crud.forgot(this.mail).then(data => {
          console.log(data.data);
          this.res = data.data;
          this.progress = false;
          this.clear()
        });
      } else {
        this.clear();
      }
    }
  }
};
</script>

