<template>
  <div
    class="course-item"
    v-for="(item, index) in list"
    :key="index"
    @click="navTo(item.id)"
  >
    <div class="cover-wrap">
      <img class="cover" :src="item.cover_img" alt="" />
      <div class="duration">{{ item.duration }}</div>
    </div>
    <div class="info">
      <div class="title">{{ item.title }}</div>
      <div class="author-info">
        <img class="avatar" :src="item.author.head_img" alt="" />
        <div class="name">{{ item.author.author_name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { CourseInfo } from "@/service/course";

const router = useRouter();

defineProps<{ list: CourseInfo[] }>();

const navTo = (id: number) =>
  router.push({ path: "/course/course_detail", query: { id } });
</script>

<style lang="stylus" scoped>
.course-item
  display flex
  padding .18rem 0
  background #fff
  .cover-wrap
    position relative
    width 2rem
    height 1.4rem
    font-size 0
    border-radius .08rem
    .cover
      width 100%
      height 100%
    .duration
      position absolute
      right .1rem
      bottom .1rem
      padding 0 .04rem
      color #fff
      font-size .2rem
      background rgba(0, 0, 0, 0.4)
  .info
    display flex
    flex-direction column
    justify-content space-between
    margin-left .16rem
    flex 1
    height 1.4rem
    .title
      color #333
      font-size .3rem
      font-weight bold
      overflow hidden
      white-space normal
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
    .author-info
      display flex
      align-items center
      .avatar
        width .4rem
        height .4rem
        border-radius 50%
      .name
        margin-left .08rem
        color #666
        font-size .24rem
</style>
