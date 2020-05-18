<template>
  <v-card  dark class="col-4 mt-5 offset-4 mr-5">
    <v-alert v-if="res!=''" dense text :type="res.type=='success'?'success':'error'">
      <strong>{{res.msg}}</strong>
    </v-alert>
    <div v-else class="font-weight-light title text-center">Entrez le nouveau mot de passe</div>

    <v-divider></v-divider>
     <v-btn v-if="!this.show" color="success" class="mt-4 mr-4" href="/" >Acceuil</v-btn>
    <div v-if="this.show" class="pa-5">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="password"
          required
          :rules="passRules"
          label="mot de pass"
          name="mot de pass"
          :type="see_password ? 'text' : 'password'"
          @click:append="see_password = !see_password"
          :append-icon="see_password ? 'mdi-eye-off' : 'mdi-eye'"
        />
        <v-btn v-if="valid" color="error" class="mt-4 mr-4" @click="validate()">soumettre</v-btn>
        <v-progress-circular size="20" indeterminate color="red" v-if="progress"></v-progress-circular>
      </v-form>
    </div>
  </v-card>
</template>
<script>
import crud from "@/services/crud/crud";

export default {
  name: "forgot",
  data: () => ({
    res: "",
    progress: false,
    see_password: false,
    password: "",
    show:true,
    valid: true,
    passRules: [
      v => !!v || "mot de pass requis ",
      v =>
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/.test(v) ||
        "Saisissez le mot de passe et soumettez [7 à 15 caractères qui contiennent au moins un chiffre et un caractère spécial]"
    ],
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
          var data = {
              password:this.password
          }
        crud.reset(data).then(data => {
          console.log(data.data);
          this.res = data.data;
          this.progress = false;
          this.clear()
        });
      } else {
        this.clear();
      }
    }
  },
  watch:{
      res(val){
          if(val.type == 'success'){
              this.show = false
          }
      }
  }
};
</script>

