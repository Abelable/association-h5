<template>
  <NavBar v-if="navBarVisible" :title="activityDetail?.title" fixed />
  <div class="container">
    <div v-if="step === 1">
      <div
        class="form-wrap"
        v-if="!isEmpty"
        :class="{ 'show-navbar': navBarVisible }"
      >
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
      <div class="empty-illus" v-if="isEmpty">
        <img class="empty-bg" src="@/assets/images/empty.png" alt="" />
        <div>活动已结束</div>
      </div>
      <div class="submit-btn" v-if="!isEmpty" @click="submit">提交</div>
      <div
        class="remark"
        v-if="
          activityDetail?.remark && activityDetail?.remark !== '<p><br></p>'
        "
      >
        <div class="title">填表须知</div>
        <div class="content" v-html="activityDetail?.remark"></div>
      </div>
    </div>
    <div class="success" v-if="step === 2">
      <img class="icon" src="@/assets/images/success.png" alt="" />
      <div class="icon-desc">报名成功</div>
      <div class="continue-btn" @click="reapply">继续报名</div>
    </div>
    <div class="error" v-if="step === 3">
      <img class="icon" src="@/assets/images/error.png" alt="" />
      <div class="icon-desc">报名失败</div>
      <div class="tips">{{ errMsg }}</div>
    </div>
  </div>
  <div class="cxxq-logo-wrap">
    <img class="cxxq-logo" src="@/assets/images/cxxq-logo.png" />
    <div class="cxxq-logo-tips">诚信星球提供技术支持</div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
  NavBar,
  Toast,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Uploader,
} from "vant";

import wx from "weixin-js-sdk-ts";
import _ from "lodash";
import { getUrlParam } from "@/utils";
import {
  ActivityInfo,
  enterFromItem,
  getActivityDetail,
  uploadFile,
  submitForm,
} from "../service/customActivity";

const id = getUrlParam("id");
const navBarVisible = ref(true);
const isEmpty = ref(false);
const step = ref(1);
const errMsg = ref("");
const activityDetail = ref<ActivityInfo>();
const submitData = ref<{ title: string; name: string; value: any }[]>([]);

onMounted(() => setActivityDetail());

const setActivityDetail = async () => {
  Toast.loading({ message: "加载中..." });
  const { enter_from_json, title, ...resData } =
    (await getActivityDetail(id)) || {};
  if (!enter_from_json) {
    isEmpty.value = true;
  }
  wx.miniProgram.getEnv((res) => {
    if (res.miniprogram) {
      navBarVisible.value = false;
      document.title = title;
    }
  });
  const enterFromList: enterFromItem[] = JSON.parse(enter_from_json);
  activityDetail.value = {
    enterFromList,
    title,
    ...resData,
  };
  initSubmitData(enterFromList);
  Toast.clear();
};

const initSubmitData = (list: enterFromItem[]) => {
  submitData.value = list.map((item) => {
    let unit: { title: string; name: string; value: undefined };
    switch (item.name) {
      case "姓名":
        unit = { title: item.name, name: "name", value: undefined };
        break;
      case "手机号":
        unit = { title: item.name, name: "mobile", value: undefined };
        break;
      case "邮箱":
        unit = { title: item.name, name: "email", value: undefined };
        break;
      default:
        unit = { title: item.name, name: "", value: undefined };
        break;
    }
    return unit;
  });
};

const submit = async () => {
  const cloneEnterFromList = _.cloneDeep(activityDetail.value?.enterFromList);
  const cloneSubmitData = _.cloneDeep(submitData.value);

  const missMsgList: string[] = [];
  (cloneEnterFromList as enterFromItem[]).forEach(async (item) => {
    if (item.required) {
      const dataItem = cloneSubmitData.find(
        (_item) => _item.title === item.name
      );
      if (!dataItem?.value) {
        missMsgList.push(`${item.name}不能为空`);
      } else if (
        item.name.includes("手机") &&
        !/^[1][3,4,5,7,8][0-9]{9}$/.test(dataItem?.value)
      ) {
        missMsgList.push("请输入正确的手机号");
      } else if (
        item.name.includes("邮箱") &&
        !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(
          dataItem?.value
        )
      ) {
        missMsgList.push("请输入正确的邮箱地址");
      }
    }
  });
  if (missMsgList.length) {
    Toast(missMsgList[0]);
    return;
  }
  Toast.loading({ message: "提交中..." });

  for (
    let index = 0;
    index < (cloneEnterFromList as enterFromItem[]).length;
    index++
  ) {
    if ((cloneEnterFromList as enterFromItem[])[index].type === 5) {
      cloneSubmitData[index].value = cloneSubmitData[index].value.join();
    }
    if (
      (cloneEnterFromList as enterFromItem[])[index].type === 6 &&
      cloneSubmitData[index].value
    ) {
      const [url = ""] =
        (await uploadFile(cloneSubmitData[index].value[0].content)) || [];
      cloneSubmitData[index].value = url;
    }
  }
  try {
    await submitForm(id, JSON.stringify(cloneSubmitData));
    Toast.clear();
    step.value = 2;
  } catch (error) {
    Toast.clear();
    step.value = 3;
    const msg = (error as { data: { EnterFrom: string[] } })?.data.EnterFrom[0];
    if (msg === "你已经报名") {
      errMsg.value = "您已报名过此活动，请不要重复报名";
    } else errMsg.value = msg;
  }
};

const reapply = () => {
  initSubmitData(activityDetail.value?.enterFromList || []);
  step.value = 1;
};
</script>

<style lang="stylus" scoped>
.container
  min-height: calc(100vh - 3.2rem);
.form-wrap
  min-height: 10vh
  background: #fff
  &.show-navbar
    margin-top: 46px
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
.cxxq-logo-wrap
  padding: .30rem 0
  font-size: 0
  text-align: center
  .cxxq-logo
    margin-left: -0.16rem;
    margin-bottom: -0.04rem;
    width: 1.86rem
    height: .73rem
  .cxxq-logo-tips
    color: #999
    font-size: .18rem
.success, .error
  display flex
  flex-direction: column
  align-items: center
  height 100vh
  background #fff
  .icon
    margin-top 2rem
    width 1.4rem
    height 1.4rem
  .icon-desc
    margin-top .5rem
    color: #333
    font-size .32rem
    font-weight: bold
  .tips
    margin-top .24rem
    color: #666
    font-size: .24rem
  .continue-btn
    margin-top 2.3rem
    width: 4.28rem
    height: .9rem
    color: #fff
    font-size: .32rem
    font-weight: bold
    text-align: center
    line-height: .9rem
    background: linear-gradient(180deg, #3FABFB 0%, #317BFF 100%)
    border-radius: .45rem
.empty-illus
  padding: 5.8rem 0
  color: #999
  font-size: .24rem
  text-align: center
  background: #fff
  .empty-bg
    width: 3rem
    height: 3rem
</style>
<style lang="stylus">
.van-nav-bar__content
  background: linear-gradient(180deg, #3FABFB 0%, #317BFF 100%)
  .van-nav-bar__title.van-ellipsis
    max-width: 100%
    color: #fff
    font-size: 0.24rem
img
  width: 100%
</style>
