<template>
  <div class="app-container">
    <router-view v-if="this.$route.name=='Line'" />
    <div v-else>
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
            <img v-if="scope.row.status && scope.row.status.status==1" style="width: 35px;" src="@/assets/images/online.png" >
            <img v-else style="width: 32px;" src="@/assets/images/off.png" >
          </template>
        </el-table-column>
        <el-table-column label="设备版本" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.version }}
          </template>
        </el-table-column>
        <el-table-column label="手机型号" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.mobile_type }}
          </template>
        </el-table-column>
        <el-table-column label="在线类型" width="160" align="center">
          <template slot-scope="scope">
            {{ scope.row.network }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="到期时间" width="240">
          <template slot-scope="scope">
            <span>{{ scope.row.end_time || '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{path:'/call/phone',query:{code:scope.row.code}}">
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
</template>

<script>
  import {
    getAppStatus
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
        listLoading: true,
        filter: {
          name: ''
        },
        timer:null
      }
    },
    created() {
      this.getList()
      //轮询保持设备实时在线
      this.timer=setInterval(()=>{
        this.getList(false)
      },2000)
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
        getAppStatus({
          page: this.page,
          limit: this.limit
        }).then(res => {
          this.list = res.data.data
          this.total = res.data.total
          if(isLoading){
            this.listLoading = false
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          }
        })
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
