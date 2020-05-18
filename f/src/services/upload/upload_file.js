import http from "../../config/http";

class UploadFilesService {
  upload(file,id, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return http.post("/upload_profile_photo/"+id, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getPhoto(id) {
    return http.get("/files/" + id);
  }
}

export default new UploadFilesService();
