<template>
  <div>
    <p>{{ priority }}. Prioritaet</p>
  </div>
</template>

<script>
export default {
  props: {
    priority: {
      type: Number,
      required: true,
    },
    isUnbookedCourses: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
</style>
