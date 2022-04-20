<template>
  <NavBar title="网商课堂" />
  <PullRefresh class="list-wrap" v-model="refreshing" @refresh="onRefresh">
    <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <CourseList :list="courseList" />
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { NavBar, PullRefresh, List } from "vant";
import CourseList from "@/components/CourseList.vue";

import { ref } from "vue";
import { CourseInfo, getCourseList } from "../service/course";
import { debounce } from "@/utils";

let page = 0;
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const courseList = ref<CourseInfo[]>([]);

const onLoadMore = debounce(() => setCourseList(), 200);
const onRefresh = () => setCourseList(true);

const setCourseList = async (init = false) => {
  if (init) page = 0;
  const list = await getCourseList(++page);
  if (list.length) {
    courseList.value = init ? list : [...courseList.value, ...list];
  } else finished.value = true;
  loading.value = false;
  refreshing.value = false;
};
</script>

<style lang="stylus" scoped></style>
