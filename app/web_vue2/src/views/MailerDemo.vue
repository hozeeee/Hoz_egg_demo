<template>
  <div style="display: flex">
    <div style="flex: 1; border-right: 1px solid #aaa; text-align: left">
      <p>
        发送邮件： <button @click="sendEmail" :disabled="loading">发送</button>
      </p>
      <hr />
      <p>
        接收地址: <span style="cursor: pointer" @click="addToItem">(+)</span>
        <template v-for="(item, index) of sendForm.toList">
          <input :key="index" type="text" v-model="sendForm.toList[index]" />
        </template>
      </p>
      <p>邮件主题:<input type="text" v-model="sendForm.subject" /></p>
      <p>邮件内容:<input type="text" v-model="sendForm.text" /></p>
      <p>邮件html:<input type="text" v-model="sendForm.html" /></p>
    </div>
    <div style="flex: 3; overflow: hidden">
      <p>
        接收邮件：
        <button @click="receiveEmail" :disabled="loading">
          接收近三天邮件
        </button>
      </p>
      <hr />
      <div
        v-for="(item, index) of emails"
        :key="index"
        style="text-align: left"
      >
        <p>from: {{ (item.headers || {}).from }}</p>
        <p>to: {{ (item.headers || {}).to }}</p>
        <p>subject: {{ (item.headers || {}).subject }}</p>
        <p>text: {{ (item.data || {}).text }}</p>
        <p>html: <span v-html="(item.data || {}).html"></span></p>
        <p>attachment: {{ (item.attachment || {}).file }}</p>
        <hr />
      </div>
    </div>
  </div>
</template>
<script>
import { post } from "@/helper/request.js";
export default {
  data() {
    return {
      loading: false,
      sendForm: {
        toList: [""],
        subject: "这是主题",
        text: "这是内容",
        html: "<h1>可选html</h1>",
      },
      emails: [],
    };
  },
  methods: {
    addToItem() {
      this.sendForm.toList.push("");
    },
    async sendEmail() {
      this.loading = true;
      await post("/nodemailer/send", JSON.stringify(this.sendForm));
      this.loading = false;
    },

    receiveEmail() {
      this.loading = true;
      this.emails = [];
      post("/nodemailer/receive")
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

