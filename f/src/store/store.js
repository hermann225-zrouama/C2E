import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user_data: "",
    exp_data: "",
    bottom_nav: "2",
  },
  mutations: {
    change(state, user_data) {
      state.user_data = user_data;
    },
    bottom_nav(state, nav) {
      state.bottom_nav = nav;
    },
    exp(state, exp_data) {
      state.exp_data = exp_data;
    },
  },
  getters: {
    user_data: (state) => state.user_data,
    bottom_nav: (state) => state.bottom_nav,
    exp_data: (state) => state.exp_data,
  },
});
