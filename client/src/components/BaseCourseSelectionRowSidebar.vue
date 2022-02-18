<template>
  <div>
    <p>{{ priority }}. Priorit&auml;t</p>
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
  methods: {},
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

p {
  position: relative;
  top: calc(50% - 1em);
}
</style>
