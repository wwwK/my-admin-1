<template>
  <div class="test-container">
    <div class="test-text">该功能正在开发中，敬请期待！</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'test',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.test {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
