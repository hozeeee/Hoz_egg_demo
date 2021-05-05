<template>
  <div>
    <input
      v-model="searchStr"
      type="text"
      placeholder="查询内容"
      :disabled="loading"
    />
    <button @click="test" :disabled="loading">获取访问截图</button>
    <span>(下面会展示操作截图)</span>
    <hr />
    <img v-for="(src, index) of imgSrcs" :src="src" :key="index" />
  </div>
</template>
<script>
import { post } from "@/helper/request.js";
export default {
  data() {
    return {
      loading: false,
      searchStr: "Hello World!",
      imgSrcs: [],
    };
  },
  methods: {
    test() {
      this.loading = true;
      this.imgSrcs = [];
      post(`/puppeter/bilibili?searchStr=${this.searchStr}`)
        .then((res) => {
          return res.json();
        })
        .then(({ data }) => {
          this.imgSrcs = Object.values(data);
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

