<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="position: relative;">
      <div style="position: absolute;right: 0;top: -40px;z-index: 999;">sda</div>
      <el-tab-pane label="设备列表" name="device">
        <deviceList :key="isUpdate"></deviceList>
      </el-tab-pane>
      <el-tab-pane label="未注册设备" name="noRegister" lazy>
        <noRegister @childFn="updateEvent"></noRegister>
      </el-tab-pane>
      <el-tab-pane label="设备组管理" name="group" lazy>
        <Group :isAddGroup='isAddGroup'></Group>
      </el-tab-pane>
      <el-tab-pane v-if="activeName == 'group'" name="btn" disabled>
        <div slot="label">
          <el-button type="primary" @click="dadda" size="small" icon="el-icon-circle-plus-outline">添加设备组</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import deviceList from './list.vue'
  import noRegister from './noRegister.vue'
  import Group from './group.vue'
  export default {
    components: {
      deviceList,
      noRegister,
      Group
    },
    data() {
      return {
        activeName: 'device',
        isAddGroup:0,
        isUpdate: 0,
      };
    },
    methods: {
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      dadda(){
        this.isAddGroup=this.isAddGroup ? 0 : 1;
      },
      /**
       * 设备注册之后，需要刷新设备列表
       */
      updateEvent(value) {
        this.isUpdate = value
      }
    }
  };
</script>
<style>
  .el-tabs__item {
    font-size: 15px !important;
    height: 45px;
  }
  .el-tabs__nav{
    width: 100%;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
  #tab-btn{
    float: right;
  }
</style>
