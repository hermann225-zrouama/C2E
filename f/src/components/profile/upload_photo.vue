<template>
  <div class="mt-4 p-3">
    <input
      type="file"
      ref="file"
      accept="image/*"
      placeholder="selectionner un fichier"
      @change="selectFile()"
    />
    <v-progress-linear v-if="selectedFiles" v-model="progress" color="amber" height="25" reactive></v-progress-linear>
    <v-btn :disabled="!selectedFiles" @click="upload()" class="mt-2 mb-3" small>uploader la photo</v-btn>
    <v-alert v-if="message!=''" border="top" colored-border type="info" elevation="2">{{message}}</v-alert>
  </div>
</template>
<script>
import upload_file from "../../services/upload/upload_file";

export default {
  data: () => ({
    selectedFiles: undefined,
    currentFile: undefined,
    progress: 0,
    message: "",

    fileInfos: []
  }),
  methods: {
    selectFile() {
      this.selectedFiles = this.$refs.file.files[0];
    },
    upload() {
      this.progress = 0;

      this.currentFile = this.selectedFiles;
      upload_file
        .upload(this.currentFile, localStorage.getItem("id"), event => {
          this.progress = Math.round((100 * event.loaded) / event.total);
        })
        .then(response => {
          this.message = response.data.msg;
          this.$store.commit("change", response.data.user_data);
        })
        .catch(err => {
          this.progress = 0;
          this.message = err;
          this.currentFile = undefined;
        });

      this.selectedFiles = undefined;
    }
  }
};
</script>