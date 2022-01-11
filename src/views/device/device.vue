<template>
  <div class="app-container">
    <!-- <div class="filter-container" style="margin-bottom: 30px;">
      设备名称：
      <el-input class="filter-item" v-model="filter.name" style="width: 180px;"></el-input>
      设备编号
      <el-input class="filter-item" v-model="filter.name" style="width: 180px;"></el-input>
      录音类型
      <el-select v-model="filter.name" placeholder="请选择活动区域">
        <el-option label="区域一" value="shanghai"></el-option>
        <el-option label="区域二" value="beijing"></el-option>
      </el-select>
      <el-input class="filter-item" v-model="filter.name" style="width: 180px;"></el-input>
    </div> -->

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
          <p>世纪科贸大厦</p>
        </template>
      </el-table-column>
      <el-table-column label="设备线路" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.line || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="去电记录" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column label="设备状态" width="160" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.status ==1 ? '启用':'禁用' " placement="left" effect="light">
            <el-switch v-model="scope.row.status" @change="changeStatus($event,scope.row)" active-color="#13ce66"
              :active-value="1" :inactive-value="2" />
            </el-switch>
          </el-tooltip>
          <!-- {{ scope.row.status }} -->
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" plain @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          <el-button size="mini" type="info" plain @click="deviceEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
    </div>

    <!-- 编辑 -->
    <el-dialog title="编辑设备" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="deviceForm" label-width="100px">
        <el-form-item label="设备名称" style="width: 70%;">
          <el-input v-model="deviceForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备编码" style="width: 50%;">
          <el-input v-model="deviceForm.code" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="设备分组" style="width: 50%;">
          <el-select v-model="deviceForm.group_id" placeholder="请选择分组">
            <el-option label="海淀区分部" value="shanghai"></el-option>
            <el-option label="朝阳区分部" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备线路" style="width: 30%;">
          <el-input v-model="deviceForm.line" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
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
          name: ''
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
        getDevice({
          page: this.page,
          limit: this.limit
        }).then(res => {
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
      /**
       * 设备编辑
       */
      deviceEdit(data) {
        this.dialogFormVisible = true
        this.deviceForm = {
          ...data
        }
      },
      /**
       * 更新设备状态
       */
      changeStatus(status, data) {
        updateStatus({
          id: data.id,
          status: status
        }).then(res => {
          this.$message({
            message: '设备状态更新成功！',
            type: 'success'
          });
        })
      },
      /**
       * 提交编辑的表单
       */
      submitEditForm() {
        this.dialogFormVisible = false
        console.log(this.deviceForm)
        updateDevice(this.deviceForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '数据更新成功！',
              type: 'success'
            });
            this.getList()
          }
        })
      },
      /**
       * 设备删除
       */
      handleDelete(data) {
        this.$confirm('将同步删除该设备数据，确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDevice(data.id).then(res => {
            if(res.code==200){
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        }).catch((err) => {
          console.log(err)
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });
      }

    }
  }
</script>
