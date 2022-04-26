<template>
  <NavBar :title="activityDetail?.title" />
  <div class="submit-btn">提交</div>
  <div class="remark" v-if="activityDetail?.remark">
    <div class="title">填表须知</div>
    <div class="content" v-html="activityDetail?.remark"></div>
  </div>
</template>

<!-- const typeOptions = [
    { id: 1, name: "单行文本框" },
    { id: 2, name: "多行文本框" },
    { id: 3, name: "数字输入框" },
    { id: 4, name: "单选按钮框" },
    { id: 5, name: "多选按钮框" },
    { id: 6, name: "图片上传框" },
  ]; -->

<script setup lang="ts">
import { NavBar } from "vant";
import { onMounted, ref } from "vue";

import { ActivityInfo, getActivityDetail } from "../service/customActivity";

const activityDetail = ref<ActivityInfo>();

onMounted(() => setActivityDetail());

const setActivityDetail = async () => {
  const { enter_from_json, ...resData } = await getActivityDetail("11");
  activityDetail.value = {
    enterFromList: JSON.parse(enter_from_json),
    ...resData,
  };
};
</script>

<style lang="stylus" scoped>
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
</style>
