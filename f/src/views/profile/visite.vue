<template>
  <div>
    <v-row justify="center">
      <v-dialog persistent v-model="dialog" max-width="300">
        <v-card>
          <v-card-title class="headline">Continuer sur la page</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="go()">continuer</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <div class="resume-wrapper">
      <section class="profile section-padding">
        <div class="container">
          <v-img
            v-if="u_data.photo!=''"
            class="img white--text align-end"
            contain
            :src="u_data.photo==''?'../../assets/Profile/profile.png': u_data.photo"
          ></v-img>
          <div class>
            <h1 class="text-wrap">{{u_data.nom}}</h1>
            <!-- YOUR NAME AND LAST NAME  -->
          </div>
          <div class="clearfix"></div>
          <div class="contact-info clearfix">
            <ul class="list-titles">
              <li>Promotion</li>
              <li>Mail</li>
              <li>Filiere</li>
              <li>Statut</li>
              <li>Telephone</li>
            </ul>
            <ul class="list-content">
              <li>{{u_data.promotion}}</li>
              <li>{{u_data.email}}</li>
              <li>
                <strong href="#">{{u_data.filiere}}</strong>
              </li>
              <li>{{ u_data.is_etudiant?'Etudiant':'Ex étudiant'}}</li>
              <li>{{u_data.telephone}}</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="experience section-padding">
        <div class="container">
          <h3 class="experience-title">Experiences Professionnelles</h3>
          <div v-if="exp != ''" class="experience-wrapper">
            <div v-for="(experience,i) in exp" :key="i">
              <div class="company-wrapper clearfix">
                <div class="experience-title">
                  <strong>Entité:</strong>
                  {{experience.company}}
                </div>
                <div class="time">
                  <strong>période:</strong>
                  {{experience.debut}} - {{experience.fin}}
                </div>
              </div>
              <div class="job-wrapper clearfix">
                <div class="experience-title">
                  <strong>job:</strong>
                  {{experience.job}}
                </div>
                <div class="company-description">
                  <p>
                    <strong>tache réalisée:</strong>
                    {{experience.description}}
                  </p>
                  <v-divider contenteditable></v-divider>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <v-alert color="blue-grey" dark dense icon="mdi-school" prominent>
              <v-row align="center">
                <v-col class="grow">Aucune experience professionnelle</v-col>
              </v-row>
            </v-alert>
          </div>
        </div>
      </section>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script>
import crud from "../../services/crud/crud";
export default {
  name: "visite",
  data() {
    return {
      exp: null,
      u_data: "",
      dialog: true
    };
  },
  methods: {
    go() {
      this.dialog = false;
      crud.get_u_data(this.$route.params.q).then(data => {
        this.u_data = data.data.user_data;
      });
      var data = {
        id: this.$route.params.q
      };
      crud.get_exp(data).then(data => {
        this.exp = data.data.exp_data;
      });
    }
  }
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Varela+Round);
@import url(
  https://fonts.googleapis.com/css?family=Open+Sans:400,
  300,
  600,
  700
);
*,
*::after,
*::before {
  box-sizing: border-box;
}

html,
body {
  height: 100%;
}

body {
  font-family: "Open Sans", sans-serif;
  font-size: 16px;
  line-height: 1.5em;
}

strong {
  color: #66cc99;
  text-decoration: none;
}

.clearfix::after,
.clearfix::before {
  content: " ";
  display: table;
}

.clearfix::after {
  clear: both;
}

.bold {
  color: #4a4e51;
  font-weight: 400;
}

.resume-wrapper {
  position: relative;
  text-align: center;
  height: 100%;
}

.container {
  min-height: 600px;
}

.profile {
  background: #fff;
  width: 40%;
  float: left;
  color: #9099a0;
}
@media (max-width: 850px) {
  .profile {
    width: 100%;
  }
}
.profile .name-wrapper {
  float: left;
  width: 60%;
}
.profile h1 {
  font-size: 2.5em;
  text-align: left;
  font-family: "Varela Round", sans-serif;
  color: #4a4e51;
  text-transform: uppercase;
  line-height: 1em;
  padding-top: 40px;
}
@media (max-width: 1200px) {
  .profile h1 {
    padding-top: 20px;
  }
}
@media (max-width: 450px) {
  .profile h1 {
    font-size: 1.8em;
    padding-top: 20px;
  }
}
.profile li {
  margin-bottom: 10px;
}
.profile .picture-resume-wrapper {
  width: 40%;
  display: block;
  float: left;
}
@media (max-width: 1200px) {
  .profile .picture-resume-wrapper {
    width: 100%;
  }
}
.profile .picture-resume {
  width: 220px;
  height: 220px;
  background-size: cover;
  margin-right: 0px;
  display: table;
  position: relative;
  vertical-align: middle;
}
.profile .picture-resume span {
  display: table-cell;
  vertical-align: middle;
  position: relative;
  margin: 0 auto;
  z-index: 10;
  text-align: center;
}
.profile .picture-resume .img {
  width: 130px;
}
@media (max-width: 1500px) {
  .profile .picture-resume .img {
    width: 80px;
  }
}
@media (max-width: 1200px) {
  .profile .picture-resume .img {
    width: 120px;
    height: 120px;
  }
}
@media (max-width: 1500px) {
  .profile .picture-resume {
    width: 150px;
    height: 150px;
  }
}
@media (max-width: 1200px) {
  .profile .picture-resume {
    width: 200px;
    height: 200px;
  }
}
@media (max-width: 450px) {
  .profile .picture-resume {
    width: 180px;
    height: 180px;
  }
}
.profile .contact-info {
  margin-top: 100px;
  font-weight: 300;
}
@media (max-width: 1200px) {
  .profile .contact-info {
    margin-top: 70px;
  }
}
@media (max-width: 450px) {
  .profile .contact-info {
    margin-top: 50px;
  }
}
.profile .list-titles {
  float: left;
  text-align: left;
  font-weight: 600;
  width: 40%;
  color: #4a4e51;
}
.profile .list-content {
  float: left;
  width: 60%;
  text-align: left;
  font-weight: 300;
}
.profile .contact-presentation {
  text-align: left;
  font-weight: 300;
  margin-top: 100px;
  margin-bottom: 100px;
}
@media (max-width: 1200px) {
  .profile .contact-presentation {
    margin-top: 70px;
    margin-bottom: 70px;
  }
}
@media (max-width: 850px) {
  .profile .contact-presentation {
    margin-top: 50px;
    margin-bottom: 50px;
  }
}
.profile svg {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.profile .st0,
.profile .st1 {
  fill: #66cc99;
}

.experience {
  background: #3d3e42;
  width: 60%;
  float: left;
  position: relative;
  color: #9099a0;
  font-weight: 300;
  min-height: 100%;
  min-height: 100vh;
}
@media (max-width: 850px) {
  .experience {
    width: 100%;
  }
}
.experience h3.experience-title {
  color: #66cc99;
  text-align: left;
  text-transform: uppercase;
  font-size: 1.2em;
  margin-bottom: 20px;
  font-weight: 400;
}
.experience .company-wrapper {
  width: 100%;
  float: left;
  text-align: left;
  padding-right: 5%;
  margin-bottom: 60px;
}
@media (max-width: 450px) {
  .experience .company-wrapper {
    width: 100%;
    margin-bottom: 20px;
  }
}
.experience .job-wrapper {
  width: 70%;
  float: left;
  text-align: left;
  padding-right: 5%;
  margin-bottom: 60px;
}
@media (max-width: 450px) {
  .experience .job-wrapper {
    width: 100%;
    margin-bottom: 40px;
  }
}
.experience .experience-title {
  color: white;
  margin-bottom: 15px;
}
</style>
