<template>
  <v-app>
    <v-app-bar dense dark app>
      <v-toolbar-title class="display-1 font-weight-thin">It-space</v-toolbar-title>

      <v-spacer></v-spacer>
      <div class="my-2">
        <v-btn depressed small>A propos</v-btn>
      </div>
    </v-app-bar>
    <v-content app class="bg-light">
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <v-row>
          <v-col class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
            <div class="box text-center">
              <div class="well-msg-1">Bienvenue sur l'It-Space</div>
              <v-img
                src="../assets/Home/img3.png"
                lazy-src="../assets/Home/lazy.png"
                aspect-ratio="1"
                class="grey lighten-2"
                max-width="500"
                max-height="300"
                contain
                gradient
              ></v-img>
              <div class="font-weight-light title text-center">
                Ancien It ? nouvel It ?
                <v-btn
                  v-if="this.switch"
                  color="error"
                  @click="log_re()"
                  depressed
                  text
                  dark
                  small
                >inscris</v-btn>
                <v-btn
                  v-if="!this.switch"
                  color="error"
                  @click="log_re()"
                  depressed
                  text
                  dark
                  small
                >connecte</v-btn>toi vite
              </div>
            </div>
          </v-col>
          <v-col class="col-lg-4 mt-10 offset-lg-1 offset-md-1 col-md-4 col-sm-12 col-xs-12">
            <v-card style="height:100%" dark elevation="4" hover raised>
              <login v-if="this.switch && !this.forgot"></login>
              <register v-if="!this.switch && !this.forgot"></register>
              <forgot v-if="this.forgot"></forgot>

              <v-card-actions>
                <div>
                  <v-btn v-if="this.switch" color text depressed @click="log_re()">inscris toi ici</v-btn>
                  <v-btn
                    v-if="!this.switch"
                    color
                    depressed
                    text
                    @click="log_re()"
                  >déja inscris connecte toi ici</v-btn>
                  <v-btn
                    v-if="this.switch && !this.forgot"
                    color
                    depressed
                    text
                    @click="forgot = true"
                  >mot de passe oublié</v-btn>
                </div>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// @ is an alias to /src
import login from "@/components/Home/login.vue";
import register from "@/components/Home/register.vue";
import forgot from "@/components/Home/forgot.vue";

export default {
  name: "Home",
  components: { login, register, forgot },
  data: function() {
    return {
      switch: true,
      forgot: false
    };
  },
  methods: {
    log_re() {
      this.switch = !this.switch;
      this.forgot = false;
    }
  }
};
</script>

<style scoped>
.well-msg-1 {
  font-size: 2.5em;
}
</style>
