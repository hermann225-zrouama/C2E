<template>
  <v-col cols="12" sm="12" lg="4" md="4">
    <v-card
      @click="setNav(nav)"
      hover
      shaped
      ripple
      width="100%"
      :href="url"
      class="mx-auto"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="200px"
        contain
        :src="require('@/assets/Profile/'+img_url)"
      ></v-img>
      <v-card-title>
        <p class="text-muted">{{titre}}</p>
      </v-card-title>
    </v-card>
  </v-col>
</template>

<script>
export default {
  name: "menu_item",
  props: {
    img_url: String,
    titre: String,
    url: String,
    nav: String
  },
  methods: {
    setNav(int) {
      localStorage.set("bottomNav", parseInt(int));
    }
  }
};
</script>