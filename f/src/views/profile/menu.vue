<template>
  <div>
    <v-row class="mt-5">
      <menu_item
        v-for="(item,i) in items"
        :key="i"
        :img_url="item.img_url"
        :url="'/#/profile/'+user_data._id+'/'+item.url"
        :titre="item.titre"
        :nav="item.nav"
      ></menu_item>
    </v-row>
  </div>
</template>
<script>
import menu_item from "../../components/profile/menu_item";
import { store } from "../../store/store";
export default {
  name: "menu",
  store,
  data() {
    return {
      items: [
        {
          img_url: "stories.png",
          titre: "Stories",
          url: "stories",
          nav: "2"
        },
        {
          img_url: "presse.png",
          titre: "Club presse",
          url: "presse",
          nav: "2"
        },
        {
          img_url: "perso.png",
          titre: "Personnel",
          url: "me",
          nav: "1"
        }
      ]
    };
  },
  components: {
    menu_item
  },
  computed: {
    user_data() {
      return this.$store.getters.user_data;
    }
  }
};
</script>