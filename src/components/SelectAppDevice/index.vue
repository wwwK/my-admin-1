<template>
  <div class="">
    <table class="app_auth_table" border="1" cellpadding="">
      <!-- <thead>
        <tr>
          <th style="width: 20%;padding: 5px;">设备组</th>
          <th>设备</th>
        </tr>
      </thead> -->
      <tbody>
        <tr v-for="(app,group_index) in appLists" :key="group_index">
          <td style="width: 20%;">
            <el-checkbox v-model="checkAlls[group_index]" @change="checked=>checkAllGroup(checked,group_index)">{{app.name}}</el-checkbox>
          </td>
          <td>
            <el-checkbox-group v-model="checkDevices[group_index]" @change="checked=>CheckedDeviceChange(checked,group_index)">
              <el-checkbox style="" v-for="(device,d_index) in app.app" :label="device.id.toString()" :key="d_index">{{device.name || device.code}}</el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons" style="margin-top: 15px;">
      <el-button size="medium" type="primary" @click="saveAppAuth">保 存</el-button>
    </div>
  </div>
</template>

<script>
  import {
    getDepartmentAppAuth,
    updateDepartment
  } from '@/api/account.js'
  export default{
    name:'SelectAppDevice',
    props:['id'],
    data(){
      return{
        isIndeterminate: true,
        checkedCities: [],
        checkAll: true,
        checkAlls:[],
        selected:[],
        checkDevices:[],
        appLists: []
      }
    },
    mounted() {
      getDepartmentAppAuth({id:this.id}).then(res=>{
        // this.checkDevices=JSON.parse(JSON.stringify(res.data.self_auth))
        this.checkDevices=res.data.self_auth
        this.appLists=res.data.app_auth
      })
    },
    methods:{
      //组全选
      checkAllGroup(checked,group_index){
        let ids =this.appLists[group_index].app.map((item)=>{
          return item.id.toString()
        })
        this.checkDevices[group_index] = checked ? ids :[],
        this.isIndeterminate = false;
      },
      CheckedDeviceChange(value,group_index){
        this.checkDevices[group_index] = value
        // console.log(this.checkDevices)
      },
      //保存权限
      saveAppAuth(){
        let arr = JSON.parse(JSON.stringify(this.checkDevices))
        let device_ids = [];
        for(let i=0;i<arr.length;i++){
          device_ids=device_ids.concat(arr[i])
        }
        updateDepartment({
          id: this.id,
          app_auth: JSON.stringify(device_ids),
          adasd:'asdas'
        }).then(res => {
          if (res.code == 200) {
            this.$emit('closeDialog',false)
            this.$message({
              message: '手机权限保存成功！',
              type: 'success'
            });
            // this.getList()
          }
        })
      },
    }
  }
</script>

<style>
  .app_auth_table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    border-radius: 15px;
    border: 1px solid #afc4db;
  }

  .app_auth_table th,
  td {
    padding: 12px;
  }
  .app_auth_table .el-checkbox-group .el-checkbox{
    margin: 5px 15px 5px 0;
  }
  .app_auth_table .el-checkbox-group .el-checkbox__label{
    padding-left: 5px;
  }
</style>
