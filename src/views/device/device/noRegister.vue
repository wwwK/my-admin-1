<template>
  <div class="app-container1" style="margin-top: 15px;">
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
      <el-table-column class-name="status-col" label="设备分组" width="150" align="center">
        <template slot-scope="scope">
          <p>无</p>
        </template>
      </el-table-column>
      <el-table-column label="设备线路" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.line || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="设备IP" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.ip || '未知' }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="接入时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="medium" type="primary" @click="register(scope.row)">注册</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
    </div>
  </div>
</template>

<script>
  import {
    getDevice,
    updateStatus,
    updateDevice,
    deleteDevice,
  } from '@/api/device.js'
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
        limit: 10,
        list: null,
        listLoading: true,
        filter: {
          name: '',
          code:'',
          group:''
        },
        dialogFormVisible: false,
        deviceForm: {},
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        let param = {
          page: this.page,
          limit: this.limit,
          status:0
        };
        param = Object.assign(param,this.filter)
        getDevice(param).then(res => {
          this.listLoading = false
          this.list = res.data.data
          this.total = res.data.total
          console.log(res)
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.getList(this.page)
      },
      indexMethod(index) {
        return index + 1 + (this.page - 1) * this.limit;
      },
      selectBtn() {
        this.getList();
      },
      /**
       * 注册（更新设备状态）
       */
      register(data) {
        updateStatus({
          code: data.code,
          status: 1
        }).then(res => {
          this.$message({
            message: '设备注册成功！',
            type: 'success'
          });
          this.$emit('childFn',1);//刷新设备列表用
          this.getList()
        })
      },

    }
  }
</script>
