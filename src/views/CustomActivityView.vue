<template>
  <NavBar :title="activityDetail?.title" />
</template>

<script setup lang="ts">
import { NavBar } from "vant";
import { onMounted, ref } from "vue";

import { ActivityInfo, getActivityDetail } from "../service/customActivity";

const activityDetail = ref<ActivityInfo>();

onMounted(() => setActivityDetail());

const setActivityDetail = async () => {
  const { enter_from_json, ...resData } = await getActivityDetail("9");
  activityDetail.value = {
    enterFromList: JSON.parse(enter_from_json),
    ...resData,
  };
};
</script>

<style lang="stylus" scoped>
.list-wrap
  padding 0 .3rem
</style>
