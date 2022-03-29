<template>
  <div class="app-containe1r">
    <router-view v-if="this.$route.name=='Line'" />
    <div v-else>
      <!-- 筛选条件 -->
      <div class="filter-container">
        <el-form :inline="true" :model="filter" ref="filter" class="demo-form-inline">
          <el-form-item label="设备名称" prop="name" style="margin-right: 30px;">
            <el-input v-model="filter.name" placeholder="请输入设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备编码" prop="code" style="margin-right: 30px;">
            <el-input v-model="filter.code" placeholder="请输入设备编码"></el-input>
          </el-form-item>
          <el-form-item style="display: block;">
            <el-button type="primary" icon="el-icon-search" size="medium" @click="onSelect">搜索</el-button>
            <el-button size="medium" @click="resetForm('filter')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 设备状态列表 -->
      <div class="app-container">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="#" type="index" align="center" :index="indexMethod" />
          <el-table-column label="设备名称" width="200" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name || '无' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备编号" width="130" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="在线状态" width="150" align="center">
            <template slot-scope="scope">
              <div v-if="onlines[scope.$index]">
                <img v-if="onlines[scope.$index].status==1" style="width: 35px;" src="@/assets/images/online.png" >
                <img v-else style="width: 32px;" src="@/assets/images/off.png" >
              </div>
              <div v-else>
                <img v-if="scope.row.status && scope.row.status==1" style="width: 35px;" src="@/assets/images/online.png" >
                <img v-else style="width: 32px;" src="@/assets/images/off.png" >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="来电记录" width="160" align="center">
            <template slot-scope="scope">
              {{ scope.row.laidian }}
            </template>
          </el-table-column>
          <el-table-column label="去电记录" width="160" align="center">
            <template slot-scope="scope">
              {{ scope.row.qudian }}
            </template>
          </el-table-column>
          <el-table-column label="未接来电" width="160" align="center">
            <template slot-scope="scope">
              {{ scope.row.weijie }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="created_at" label="最后通话时间" width="240">
            <template slot-scope="scope">
              <span v-if="scope.row.status">{{ scope.row.status.last_call_time || '无'}}</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <router-link :to="{path:'/status/device/line',query:{code:scope.row.code}}">
                <el-button size="mini" type="warning" plain >端口</el-button>
                <!-- <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row)">端口</el-button> -->
              </router-link>
              <router-link :to="{path:'/call/device',query:{code:scope.row.code}}">
                <el-button size="mini" type="info" plain style="margin-left: 10px;">记录</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    getDeviceStatus,getDeviceOnline
  } from '@/api/status.js'
  import Pagination from '@/components/Pagination'

  export default {
    components: {
      Pagination
    },
    filters: {
      statusFilter(type) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[type]
      }
    },
    data() {
      return {
        total: 10,
        page: 1,
        limit: 20,
        list: null,
        codes:[],
        onlines:[],
        listLoading: true,
        filter: {
          name: '',
          code:''
        },
        timer:null
      }
    },
    created() {
      this.getList()
      //轮询保持设备实时在线
      this.timer=setInterval(()=>{
        if(this.$route.path =='/status/device'){
          this.getDeviceOnline()
        }
      },2500)
    },
    beforeDestroy() {
      if(this.timer){
        clearInterval(this.timer)
      }
    },
    methods: {
      getList(isLoading=true) {
        if(isLoading){
          this.listLoading = true
        }
        let param = {
          page: this.page,
          limit: this.limit
        };
        param = Object.assign(param, this.filter)
        getDeviceStatus(param).then(res => {
          this.list = res.data.data
          this.codes=this.list.map((item)=>{
            return item.code
          })
          this.total = res.data.total
          if(isLoading){
            this.listLoading = false
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        })
      },
      //用于轮询实时更新在线状态
      getDeviceOnline(){
        getDeviceOnline({codes:this.codes}).then(res=>{
          this.onlines=res.data
        })
      },
      onSelect() {
        this.getList()
      },
      resetForm(formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields();
      },
      handleCurrentChange(val) {
        this.page = val
        this.getList(this.page)
      },
      indexMethod(index) {
        return index + 1 + (this.page - 1) * this.limit;
      }
    }
  }
</script>
