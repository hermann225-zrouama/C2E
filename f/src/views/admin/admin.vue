<template>
  <v-app>
    <v-navigation-drawer mobile-break-point="650" expand-on-hover app dark permanent>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :href="item.href" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn @click="logout()" block>Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar color="orange accent-3" app dense dark>
      <v-toolbar-title v-if="user_data!=''" class>{{user_data.email}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :href="'/#/profile/'+user_data._id+'/menu'">profil</v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialog" width="600px">
          <v-card>
            <v-card>
              <v-container v-if="response!=''">
                <v-row dense>
                  <v-col class="p-5" v-for="(item, j) in response" :key="j" cols="12">
                    <v-card @click="route(item._id)" hover color="#1F7087" dark>
                      <div class="d-flex flex-no-wrap justify-space-between">
                        <v-row>
                          <v-col cols="12" md="8" lg="8" xl="8">
                            <div>
                              <v-card-title class="headline" v-text="item.nom"></v-card-title>
                              <v-card-subtitle v-text="item.filiere+' '+item.promotion"></v-card-subtitle>
                            </div>
                          </v-col>
                          <v-col cols="12" md="4" lg="4" xl="4">
                            <v-avatar class="ma-3" size="125" tile>
                              <v-img :src="item.photo"></v-img>
                            </v-avatar>
                          </v-col>
                        </v-row>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
              <v-card-title v-else class="headline">Aucune correspondance</v-card-title>
            </v-card>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="close">fermer</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-spacer></v-spacer>
      <v-text-field
        @input="search()"
        v-model="query"
        dense
        single-line
        solo
        flat
        label="recherche"
        class="mt-6"
      ></v-text-field>
    </v-app-bar>
    <v-content class="bg-light">
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>

    <v-footer fixed padless app></v-footer>
  </v-app>
</template>
<script>
import { store } from "../../store/store";
import crud from "@/services/crud/crud";

export default {
  store,
  data() {
    return {
      query: "",
      user_data: "",
      response: "",
      progress: false,
      dialog: false,
      items: [
        {
          title: "All user",
          icon: "mdi-account-search",
          href: "/#/admin/" + this.$route.params.id + "/all_user"
        },
        {
          title: "Stats globales",
          icon: "mdi-clipboard-text",
          href: "/#/admin/" + this.$route.params.id + "/stat"
        }
      ]
    };
  },
  methods: {
    route(id) {
      document.location.href =
        "http://" +
        document.location.host +
        "/#/profile/" +
        this.user_data._id +
        "/visite/" +
        id;
      document.location.reload();
    },
    is_connected() {
      if (localStorage.getItem("id")) {
        this.refresh();
      } else {
        document.location.href = "http://" + document.location.host;
      }
    },
    refresh() {
      crud.get_u_data(localStorage.getItem("id")).then(data => {
        if (data.data.user_data.access_level == "ADMIN") {
          this.user_data = data.data.user_data;
          this.$store.commit("change", data.data.user_data);
        } else {
          this.logout();
        }
      });
      var data = {
        id: localStorage.getItem("id")
      };
      crud.get_exp(data).then(data => {
        this.$store.commit("exp", data.data.exp_data);
      });
    },
    logout() {
      if (localStorage.getItem("id") != null) {
        crud.logout(localStorage.getItem("id")).then(function() {
          localStorage.removeItem("id");
          document.location.href = `http://${document.location.host}`;
        });
      } else {
        document.location.href = `http://${document.location.host}`;
      }
    },
    search() {
      if (this.query != "" && this.query.length >= 2) {
        this.progress = true;
        var data = {
          query: this.query
        };
        crud.get_user(data).then(res => {
          this.response = res.data;
          console.log(this.response);
          this.progress = false;
          this.dialog = true;
        });
      } else {
        this.response = "";
      }
    },
    close() {
      this.dialog = false;
      this.query = "";
    }
  },
  mounted: function() {
    this.is_connected();
  },
  watch: {
    response(val) {
      if (val == "") {
        this.response = "";
      }
    }
  }
};
</script>