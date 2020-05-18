<template>
  <v-col cols="9" offset-xl="3" lg="6" md="6" xl="6">
    <v-card class="p-4" dark>
      <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
        <strong>{{res.msg}}</strong>
      </v-alert>
      <div v-else class="font-weight-light title text-center">Connexion Admin</div>
      <v-divider></v-divider>
      <div class="pa-5">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field v-model="user_data.email" :rules="emailRules" label="E-mail" required></v-text-field>

          <v-text-field
            v-model="user_data.password"
            required
            :rules="passRules"
            label="mot de pass"
            name="mot de pass"
            :type="see_password ? 'text' : 'password'"
            @click:append="see_password = !see_password"
            :append-icon="see_password ? 'mdi-eye-off' : 'mdi-eye'"
          />
          <v-btn v-if="valid" color="blue" class="mt-4 mr-4" @click="validate()">Connexion</v-btn>
          <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
        </v-form>
      </div>
    </v-card>
  </v-col>
</template>
<script>
import crud from "@/services/crud/crud";
import { store } from "../../store/store";

export default {
  store,
  data: () => ({
    progress: false,
    res: "",
    user_data: {
      email: "",
      password: ""
    },
    valid: true,
    see_password: false,
    passRules: [
      v => !!v || "mot de pass requis ",
      v =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(v) ||
        "Saisissez le mot de passe et soumettez [7 à 15 caractères qui contiennent au moins un chiffre et un caractère spécial]"
    ],
    emailRules: [
      v => !!v || "addresse email requise",
      v => /.+@.+\..+/.test(v) || "l'email n'est pas valide"
    ]
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
      this.login();
    },
    clear() {
      this.$refs.form.reset();
    },
    login() {
      this.progress = true;
      if (this.user_data.email != "" && this.user_data.password != "") {
        var data = {
          email: this.user_data.email.toLowerCase(),
          password: this.user_data.password,
          last_connection: Date()
        };
        crud.auth(data).then(data => {
          this.res = data.data;
          this.progress = false;
          this.clear();
        });
      } else {
        this.$refs.form.validate();
      }
    },
    stored(val) {
      this.$store.commit("change", val.user_data);
      localStorage.setItem("id", val.user_data._id);
      document.location.href = `http://${document.location.host}/#/profile/${val.user_data._id}/menu`;
    }
  },
  watch: {
    res: function(val) {
      if (val.type == "success" && val.user_data.access_level == "ADMIN") {
        this.stored(val);
      } else if (
        val.type == "success" &&
        val.user_data.access_level != "ADMIN"
      ) {
        this.res.msg = "vous n'etes pas administrateur desolé";
      }
    }
  }
};
</script>

