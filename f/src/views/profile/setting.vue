<template>
  <v-row>
    <v-col cols="12" sm="12" md="4" lg="4" xl="4">
      <v-card light>
        <v-card-subtitle>Uploader ou modifier sa photo de profil</v-card-subtitle>
        <upload></upload>
      </v-card>
      <exp class="mt-6"></exp>
    </v-col>
    <v-col cols="12" sm="12" md="6" lg="6" xl="6" offset-lg="2" offset-md="2" offset-xl="2">
      <v-btn
        v-if="!this.ready_to_update"
        color="error"
        class="mt-4 mr-4"
        @click="append_update()"
      >mettre a jour ses infos</v-btn>

      <v-card v-if="this.ready_to_update" dark>
        <div>
          <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
            <strong>{{res.msg}}</strong>
          </v-alert>
          <div v-else class="font-weight-light title text-center">Mettre a jour mes infos</div>

          <v-divider></v-divider>
          <div v-if="!end_update" class="pa-5">
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="user_data.fullname"
                :rules="fullnameRules"
                required
                label="fullname"
              ></v-text-field>
              <v-text-field
                v-model="user_data.telephone"
                :rules="telRules"
                required
                label="telephone"
              ></v-text-field>
              <v-select
                v-model="user_data.promotion"
                :rules="promoRules"
                :items="promotions"
                label="Promotion"
                dense
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
              <v-switch v-model="user_data.is_etudiant" color="green" label="je suis etudiant"></v-switch>
              <v-btn v-if="valid" color="blue" class="mt-4 mr-4" @click="validate()">mettre a jour</v-btn>
              <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
            </v-form>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import { store } from "../../store/store";
import crud from "../../services/crud/crud";
import upload from "../../components/profile/upload_photo";
import exp from "../../components/profile/exp";

export default {
  name: "setting",
  store,
  components: { upload, exp },
  data() {
    return {
      end_update: false,
      ready_to_update: false,
      progress: false,
      user_data: {
        filiere: "",
        promotion: "",
        fullname: "",
        is_etudiant: "",
        telephone: ""
      },
      res: "",
      promotions: [
        "it1",
        "it2",
        "it3",
        "it4",
        "it5",
        "it6",
        "it7",
        "it8",
        "it9"
      ],
      filieres: ["RTEL", "SIGL", "TWIN", "SRIT", "SITW", "MBDS", "MDSI"],
      valid: false,
      telRules: [
        v => !!v || "numéro de telephone requis ",
        v => /^\d{8}$/.test(v) || "numero de telephone invalid"
      ],
      passRules: [
        v => !!v || "mot de pass requis ",
        v =>
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(v) ||
          "Saisissez le mot de passe et soumettez [7 à 15 caractères qui contiennent au moins un chiffre et un caractère spécial]"
      ],
      fullnameRules: [v => !!v || "le nom est requis"],
      promoRules: [v => !!v || "la promotion est requise"],
      filiereRules: [v => !!v || "la filière est requise"]
    };
  },
  methods: {
    append_update() {
      this.ready_to_update = !this.ready_to_update;
      this.user_data.fullname = this.$store.getters.user_data.nom;
      this.user_data.filiere = this.$store.getters.user_data.filiere;
      this.user_data.promotion = this.$store.getters.user_data.promotion;
      this.user_data.is_etudiant = this.$store.getters.user_data.is_etudiant;
      this.user_data.telephone = this.$store.getters.user_data.telephone;
    },
    validate() {
      this.$refs.form.validate();
      this.update();
    },
    clear() {
      this.$refs.form.reset();
    },
    update() {
      this.progress = true;
      if (
        this.user_data.filiere != "" &&
        this.user_data.promotion != "" &&
        this.user_data.fullname != "" &&
        this.user_data.telephone != ""
      ) {
        var data = {
          filiere: this.user_data.filiere,
          promotion: this.user_data.promotion,
          nom: this.user_data.fullname,
          is_etudiant: this.user_data.is_etudiant,
          id: localStorage.getItem("id"),
          telephone: this.user_data.telephone
        };

        crud.update(data).then(data => {
          this.$store.commit("change", data.data.user_data);
          this.res = data.data;
          this.progress = false;
          this.clear();
          this.end_update = true;
        });
      } else {
        this.$refs.form.validate();
      }
    }
  }
};
</script>