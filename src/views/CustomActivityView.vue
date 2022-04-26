<template>
  <NavBar :title="activityDetail?.title" fixed />
  <div class="form-wrap">
    <div
      class="form-item"
      v-for="(item, index) in activityDetail?.enterFromList"
      :key="index"
    >
      <div class="title" :class="{ required: item.required }">
        <span>{{ item.name }}</span>
        <span v-if="item.type === 5">（可多选）</span>
      </div>
      <input
        class="input"
        v-if="item.type === 1"
        v-model="submitData[index].value"
        :placeholder="`请输入${item.name}`"
      />
      <textarea
        class="textarea"
        v-if="item.type === 2"
        v-model="submitData[index].value"
        :placeholder="`请输入${item.name}`"
      />
      <input
        class="input"
        type="number"
        v-if="item.type === 3"
        v-model="submitData[index].value"
        :placeholder="`请输入${item.name}`"
      />
      <RadioGroup
        class="radio-group"
        v-if="item.type === 4"
        v-model="submitData[index].value"
      >
        <Radio
          class="radio"
          v-for="(_item, _index) in item.options"
          :key="_index"
          :name="_item"
          >{{ _item }}</Radio
        >
      </RadioGroup>
      <CheckboxGroup
        class="checkbox-group"
        v-if="item.type === 5"
        v-model="submitData[index].value"
      >
        <Checkbox
          class="checkbox"
          v-for="(_item, _index) in item.options"
          :key="_index"
          :name="_item"
          >{{ _item }}</Checkbox
        >
      </CheckboxGroup>
      <Uploader
        class="uploader"
        v-model="submitData[index].value"
        v-if="item.type === 6"
        max-count="1"
      />
    </div>
  </div>
  <div class="submit-btn" @click="submit">提交</div>
  <div class="remark" v-if="activityDetail?.remark">
    <div class="title">填表须知</div>
    <div class="content" v-html="activityDetail?.remark"></div>
  </div>
  <div class="youbo-logo-wrap">
    <img class="youbo-logo" src="@/assets/images/youbo-logo.png" />
    <div class="youbo-logo-tips">有播提供技术支持</div>
  </div>
</template>

<script setup lang="ts">
import { getUrlParam } from "@/utils";
import {
  NavBar,
  Toast,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Uploader,
} from "vant";
import { onMounted, ref } from "vue";

import {
  ActivityInfo,
  enterFromItem,
  getActivityDetail,
  uploadFile,
  submitForm,
} from "../service/customActivity";

const id = getUrlParam("id");
const activityDetail = ref<ActivityInfo>();
const submitData = ref<{ name: string; value: any }[]>([]);

onMounted(() => setActivityDetail());

const setActivityDetail = async () => {
  Toast.loading({ message: "加载中..." });
  const { enter_from_json, ...resData } = await getActivityDetail(id);
  Toast.clear();
  const enterFromList: enterFromItem[] = JSON.parse(enter_from_json);
  activityDetail.value = {
    enterFromList,
    ...resData,
  };
  submitData.value = enterFromList.map((item) => ({
    name: item.name,
    value: undefined,
  }));
};

const submit = async () => {
  const missMsgList: string[] = [];
  activityDetail.value?.enterFromList.forEach(async (item, index) => {
    if (item.required) {
      const dataItem = submitData.value.find(
        (_item) => _item.name === item.name
      );
      if (!dataItem?.value) missMsgList.push(`${item.name}不能为空`);
    }
    if (item.type === 6 && typeof submitData.value[index].value !== "string") {
      const [url = ""] =
        (await uploadFile(submitData.value[index].value[0].content)) || [];
      submitData.value[index].value = url;
    }
  });
  if (missMsgList.length) {
    Toast(missMsgList[0]);
    return;
  }
  Toast.loading({ message: "提交中..." });
  const enterFromList = activityDetail.value?.enterFromList || [];
  for (let index = 0; index < enterFromList.length; index++) {
    if (enterFromList[index].type === 5) {
      submitData.value[index].value = submitData.value[index].value.join();
    }
    if (enterFromList[index].type === 6) {
      const [url = ""] =
        (await uploadFile(submitData.value[index].value[0].content)) || [];
      submitData.value[index].value = url;
    }
  }
  await submitForm(id, JSON.stringify(submitData));
  Toast("报名成功");
};
</script>

<style lang="stylus" scoped>
.form-wrap
  margin-top: 46px
  min-height: 10vh
  background: #fff
  .form-item
    padding: .24rem .36rem
    font-size: 0
    border-bottom: 1px solid #f7f7f7
    &:last-child
      border-bottom: none
    .title
      color: #333
      font-size: .32rem
      font-weight: bold
      &.required
        position relative
        &::before
          position: absolute
          top: .02rem
          left: -0.2rem
          color: #FF3838
          content: "*"
          font-weight: bold
    .input, .textarea
      margin-top .12rem
      padding .15rem
      font-size .28rem
      background #f4f4f4
      border none
      border-radius .1rem
    .input
      width 6.8rem
      height .8rem
    .textarea
      width 6.5rem
      height 2rem
    .radio-group
      font-size: .28rem
      .radio
        margin-top: .20rem
    .checkbox-group
      font-size: .28rem
      .checkbox
        margin-top: .20rem
    .uploader
      margin-top: .20rem
.submit-btn
  margin: .50rem .88rem
  height: .96rem
  color: #fff
  font-size: .36rem
  font-weight: bold
  text-align: center
  line-height: .96rem
  border-radius: .48rem
  background: linear-gradient(180deg, #3FABFB 0%, #317BFF 100%)
.remark
  .title
    position: relative
    margin-left: .30rem
    color: #333
    font-size: .32rem
    font-weight: bold
    &::after
      position: absolute
      left: 0
      bottom: 0
      width: .64rem
      height: .08rem
      content: ''
      background: #408BF1
  .content
    margin-top: .20rem
    padding: .30rem
    font-size: .28rem
    background: #fff
.youbo-logo-wrap
  padding: .30rem 0
  font-size: 0
  text-align: center
  .youbo-logo
    width: 1.20rem
    height: .28rem
  .youbo-logo-tips
    margin-top: .06rem
    color: #999
    font-size: .18rem
</style>
<style lang="stylus">
.van-nav-bar__content
  background: linear-gradient(180deg, #3FABFB 0%, #317BFF 100%)
  .van-nav-bar__title.van-ellipsis
    color: #fff
</style>
