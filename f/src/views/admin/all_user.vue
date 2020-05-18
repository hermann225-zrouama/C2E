<template>
  <v-container fluid>
    <v-dialog persistent v-model="dialog" max-width="300">
      <v-card>
        <v-card-title class="headline">Continuer sur la page</v-card-title>
        <v-card-text class="text--primary">
          <li>Vous serez tenu responsable de toutes actions</li>

          <li>Faites attention a ou vous mettez le curseur</li>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="go()">continuer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog1" max-width="300">
      <v-card>
        <v-card-title class="headline">Confirmer l'action</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="confirm()">confirmer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-iterator
      v-if="items!=null"
      :items="items"
      :items-per-page.sync="itemsPerPage"
      :page="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark class="mb-1">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn large depressed color="orange accent-3" :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn large depressed color="orange accent-3" :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row>
          <v-col v-for="item in props.items" :key="item.nom" cols="12" sm="6" md="4" lg="3">
            <v-card outlined>
              <v-card-title class="subheading font-weight-bold">{{ item.nom }}</v-card-title>

              <v-divider></v-divider>

              <v-list dense>
                <v-list-item v-for="(key, index) in filteredKeys" :key="index">
                  <v-list-item-content
                    class="d-inline-block text-truncate"
                    :class="{ 'blue--text': sortBy === key }"
                  >{{ key }}:</v-list-item-content>
                  <v-list-item-content
                    class="align-end d-inline-block"
                    :class="{ 'blue--text': sortBy === key }"
                  >{{ item[key.toLowerCase()] }}</v-list-item-content>
                </v-list-item>
              </v-list>
              <div class="p-4">
                <v-btn text @click="drop(item['_id'])" color="error">delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  text
                  @click="item['access_level']=='ADMIN'?denommer(item['_id']):nommer(item['_id'])"
                  color="error"
                >{{item['access_level']=='ADMIN'?'retirer des admins':'nommer admin'}}</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-2" align="center" justify="center">
          <span class="grey--text">elements par page</span>
          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn dark text color="orange accent-3" class="ml-2" v-on="on">
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">Page {{ page }} sur {{ numberOfPages }}</span>
          <v-btn fab dark color="orange accent-3" class="mr-1" @click="formerPage">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab dark color="orange accent-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </v-container>
</template>
<script>
import crud from "../../services/crud/crud";

export default {
  data() {
    return {
      dialog: true,
      dialog1: false,
      ready: false,
      itemsPerPageArray: [2, 3, 4],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: "nom",
      keys: [
        "nom",
        "promotion",
        "is_etudiant",
        "filiere",
        "connected",
        "email",
        "last_connection",
        "telephone",
        "_id",
        "access_level"
      ],

      items: null
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter(key => key !== `nom`);
    }
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    go() {
      this.dialog = false;
      crud.fetch_all_user().then(data => {
        this.items = data.data.user_data;
      });
    },
    confirm() {
      this.ready = true;
      this.dialog1 = false;
    },
    drop(id) {
      var data = { id: id };
      crud.drop_user(data).then(() => {
        this.items = "";
        document.location.reload();
      });
    },
    nommer(id) {
      var data = { id: id };
      crud.nommer_user(data).then(() => {
        document.location.reload();
      });
    },
    denommer(id) {
      var data = { id: id };
      crud.denommer_user(data).then(() => {
        document.location.reload();
      });
    }
  }
};
</script>