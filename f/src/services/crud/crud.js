import http from "../../config/http";

class Crud {
  create(data) {
    return http.post("register", data);
  }
  auth(data) {
    return http.post("auth", data);
  }
  get_u_data(id) {
    return http.get(`get_u_data/${id}`);
  }
  logout(id) {
    return http.get("logout/" + id);
  }
  forgot(mail) {
    return http.get("forgot/" + mail);
  }
  reset(password) {
    return http.post("reset", password);
  }
  update(data) {
    return http.post("update", data);
  }
  get_user(data) {
    return http.post("search", data);
  }
  fetch_all_user() {
    return http.get("fetch_all_user");
  }
  save_exp(data) {
    return http.post("save_experience", data);
  }
  get_exp(data) {
    return http.post("get_experience", data);
  }

  drop_user(data) {
    return http.post("drop_user", data);
  }
  nommer_user(data) {
    return http.post("nommer_user", data);
  }
  denommer_user(data) {
    return http.post("denommer_user", data);
  }
}

export default new Crud();

/*  */
