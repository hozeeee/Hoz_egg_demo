<template>
  <div>
    <p>主要看后端接口的内容</p>
    <hr>
    <div><button @click="testHttpClientPost">post</button></div>
    <hr />
    <div></div>
    <div>
      <button @click="testHttpClientUpload">upload</button>
      &nbsp;
      <button @click="testHttpClientUploadStream">uploadStream</button>
    </div>
    <hr />
  </div>
</template>
<script>
import { post } from "@/helper/request.js";
export default {
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    testHttpClientPost() {
      this.loading = true;
      this.emails = [];
      post("/httpClient/post")
        .then((res) => {
          return res.json();
        })
        .then(({ data }) => {
          this.emails = data;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    testHttpClientUpload() {
      this.loading = true;
      this.emails = [];
      post("/httpClient/upload")
        .then((res) => {
          return res.json();
        })
        .then(({ data }) => {
          this.emails = data;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    testHttpClientUploadStream() {
      this.loading = true;
      this.emails = [];
      post("/httpClient/uploadByStream")
        .then((res) => {
          return res.json();
        })
        .then(({ data }) => {
          this.emails = data;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
  },
};
</script>

