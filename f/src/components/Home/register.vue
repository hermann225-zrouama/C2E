<template>
  <div>
    <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
      <strong>{{res.msg}}</strong>
    </v-alert>
    <div v-else class="font-weight-light title text-center">Inscription</div>

    <v-divider></v-divider>
    <div class="pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="user_data.email" :rules="emailRules" label="E-mail" required></v-text-field>
        <v-text-field v-model="user_data.fullname" :rules="fullnameRules" required label="fullname"></v-text-field>
        <v-text-field v-model="user_data.telephone" :rules="telRules" required label="telephone"></v-text-field>
        <v-select
          v-model="user_data.promotion"
          :rules="promoRules"
          :items="promotions"
          label="Promotion"
          denseemail
          required
        ></v-select>
        <v-select
          v-model="user_data.filiere"
          :rules="filiereRules"
          :items="filieres"
          label="filieres"
          dense
          required
        ></v-select>
        <v-text-field
          required
          v-model="user_data.password"
          :rules="passRules"
          label="mot de pass"
          name="mot de pass"
          :type="see_password ? 'text' : 'password'"
          @click:append="see_password = !see_password"
          :append-icon="see_password ? 'mdi-eye-off' : 'mdi-eye'"
        />
        <v-switch v-model="user_data.is_etudiant" color="green" label="je suis etudiant"></v-switch>
        <v-btn v-if="valid" color="blue" class="mt-4 mr-4" @click="validate()">Inscription</v-btn>
        <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
      </v-form>
    </div>
  </div>
</template>
<script>
import crud from "@/services/crud/crud";

export default {
  data: () => ({
    progress: false,
    user_data: {
      email: "",
      password: "",
      filiere: "",
      promotion: "",
      fullname: "",
      is_etudiant: true,
      telephone: ""
    },
    res: "",
    promotions: ["it1", "it2", "it3", "it4", "it5", "it6", "it7", "it8", "it9"],
    filieres: ["RTEL", "SIGL", "TWIN", "SRIT", "SITW", "MBDS", "MDSI"],
    valid: false,
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
    ],
    fullnameRules: [v => !!v || "le nom est requis"],
    promoRules: [v => !!v || "la promotion est requise"],
    filiereRules: [v => !!v || "la filière est requise"],
    telRules: [
      v => !!v || "numéro de telephone requis ",
      v => /^\d{8}$/.test(v) || "numero de telephone invalid"
    ]
  }),

  methods: {
    validate() {
      this.$refs.form.validate();
      this.register();
    },
    clear() {
      this.$refs.form.reset();
    },
    register() {
      this.progress = true;
      if (
        this.user_data.email != "" &&
        this.user_data.password != "" &&
        this.user_data.filiere != "" &&
        this.user_data.promotion != "" &&
        this.user_data.fullname != "" &&
        this.user_data.telephone != ""
      ) {
        var data = {
          email: this.user_data.email.toLowerCase(),
          password: this.user_data.password,
          filiere: this.user_data.filiere,
          promotion: this.user_data.promotion,
          nom: this.user_data.fullname,
          is_etudiant: this.user_data.is_etudiant,
          telephone: this.user_data.telephone
        };

        crud.create(data).then(data => {
          this.res = data.data;
          this.progress = false;
          this.clear();
        });
      } else {
        this.$refs.form.validate();
      }
    }
  }
};
</script>

