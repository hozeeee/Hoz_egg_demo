<template>
  <div>
    <div class="container">
      <div class="_left">
        <p>发送内容:</p>
        <div>
          <span>foo: </span>
          <input type="text" v-model="foo" />
        </div>
        <div>
          <span>baz: </span>
          <input type="text" v-model="baz" />
        </div>
      </div>
      <div class="_right">
        <button @click="sendJson">发送 JSON 格式的数据</button>
        <hr />
        <button @click="sendForm">发送 form 格式的数据</button>
        <hr />
        <button @click="sendFormData">发送 FormData 格式的数据</button>
        <hr />
        <button @click="sendQuery">发送 query 格式的数据（url 传参）</button>
        <hr />
        <button @click="sendParams">发送 params 格式的数据（路由传参）</button>
      </div>
    </div>
    <div class="container">
      <div class="_left">
        <p>单文件上传:</p>
        <div>
          <span>file: </span>
          <input type="file" ref="file" />
        </div>
      </div>
      <div class="_right">
        <button @click="sendSingleFile">发送单文件</button>
      </div>
    </div>
    <div class="container">
      <div class="_left">
        <p>多文件上传:</p>
        <div>
          <span>field1: </span>
          <input type="text" ref="field1" />
        </div>
        <div>
          <span>file2: </span>
          <input type="file" ref="file2" />
        </div>
        <div>
          <span>field2: </span>
          <input type="text" ref="field2" />
        </div>
        <div>
          <span>file3: </span>
          <input type="file" ref="file3" />
        </div>
      </div>
      <div class="_right">
        <button @click="sendMultiFiles">发送多个文件 & 携带普通字段</button>
      </div>
    </div>
    <div style="text-align: left">
      <div>注意事项：</div>
      <ul>
        <li>通过 new FormData() 可以创建用于发送 multipart/form-data 的数据</li>
        <li>
          发送 form-data 时，不需要手动设置
          Content-Type，否则会导致服务端无法识别
        </li>
        <li>
          formData 可以使用 append
          方法添加字段和值，对同一个字段名添加值，后者不会覆盖前者，都会传到后台
        </li>
        <li>
          对于带有 multiple 属性的
          input:file，就等同于对同一个字段名添加多个文件
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { post } from "@/helper/request.js";

export default {
  data() {
    return {
      foo: "",
      baz: "",
    };
  },
  methods: {
    // Content-Type 是 application/json
    // 需要使用 JSON.stringify 将数据格式化为 JSON 字符串
    sendJson() {
      const obj = { foo: this.foo, baz: this.foo };
      const bodyData = JSON.stringify(obj);
      post("/api/demo/json", bodyData);
    },

    // Content-Type 是 application/x-www-form-urlencoded
    // body 是字符串，如 "username=zhangsan&password=123456"
    sendForm() {
      const obj = { foo: this.foo, baz: this.foo };
      const bodyData = Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .reduce((sum, val) => sum + val + "&", "");
      post("/api/demo/form", bodyData, "application/x-www-form-urlencoded");
    },

    // Content-Type 是 multipart/form-data，但不要手动设置
    // 需要创建 FormData 对象，赋值给发送的 body 即可
    sendFormData() {
      const obj = { foo: this.foo, baz: this.baz };
      const bodyData = new FormData();
      for (const key in obj) {
        bodyData.append(key, obj[key]);
      }
      post("/api/demo/formData", bodyData);
    },

    // 和 form 类似，只是把 "body" 的数据放到 url 中
    sendQuery() {
      const obj = { foo: this.foo, baz: this.foo };
      const _data = Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .reduce((sum, val) => sum + val + "&", "");
      post(`/api/demo/query?${_data}`);
    },

    // 路由传参
    sendParams() {
      // 路由传参 /api/demo/params/:foo/:baz
      post(`/api/demo/params/${this.foo}/${this.baz}`);
    },

    // 发送单个文件
    sendSingleFile() {
      const bodyData = new FormData();
      const fileInput = this.$refs.file;
      const file = fileInput.files[0];
      if (!file) return;
      bodyData.append("file", file);
      post("/api/demo/singleFile", bodyData);
    },

    // 发送多个文件
    sendMultiFiles() {
      const bodyData = new FormData();
      const fileInput2 = this.$refs.file2;
      const file2 = fileInput2.files[0];
      const fileInput3 = this.$refs.file3;
      const file3 = fileInput3.files[0];
      const field1 = this.$refs.field1.value;
      const field2 = this.$refs.field2.value;
      if (!file2 || !file3) return;
      bodyData.append("file2", file2);
      bodyData.append("file3", file3);
      bodyData.append("field1", field1);
      bodyData.append("field2", field2);
      post("/api/demo/multiFiles", bodyData);
    },
  },
};
</script>
<style scoped lang="less">
.container {
  display: flex;
  border-bottom: 1px solid #aaa;
  ._left {
    border-right: 1px solid #aaa;
    padding: 10px;
  }
  ._right {
    flex: 1;
    padding: 10px 0;
  }
}
</style>