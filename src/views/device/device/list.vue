<template>
  <div class="app-container1" style="margin-top: 15px;">
    <div class="filter-container1" style="margin-bottom: 30px;">
      <el-input class="filter-item" v-model="filter.name" size="small" placeholder="设备名称" style="width: 180px;margin-right: 30px;">
      </el-input>
      <el-input class="filter-item" v-model="filter.code" size="small" placeholder="设备编号" style="width: 180px;margin-right: 30px;">
      </el-input>
      <el-select requie v-model="filter.group_id" size="small" placeholder="请选择分组">
        <el-option label="无" value="0"></el-option>
        <el-option v-for="(item,index) in pnames" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="small" @click="selectBtn" icon="el-icon-search" style="float: right;">查询</el-button>
    </div>
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
          <el-tag :type="scope.row.group.length >0 ? '' :'info'">{{ scope.row.group.length >0 ? scope.row.group[0].name : '无' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备线路" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.line || '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="设备IP" width="160" align="center">
        <template slot-scope="scope">
          {{ scope.row.ip || '未知'}}
        </template>
      </el-table-column>
      <el-table-column label="设备状态" width="160" sortable align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.status ==1 ? '启用':'禁用' " placement="left" effect="light">
            <el-switch v-model="scope.row.status" @change="changeStatus($event,scope.row)" active-color="#13ce66"
              :active-value="1" :inactive-value="2" />
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="接入时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="250">
        <template slot-scope="scope">
          <router-link :to="{path:'/call/device',query:{code:scope.row.code}}">
            <el-button size="mini" type="warning" plain style="margin-right: 10px;">查看</el-button>
          </router-link>
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
        <el-form-item label="设备分组" prop="group_id" style="width: 50%;">
          <el-select requie v-model="deviceForm.group_id" placeholder="请选择分组">
            <!-- <el-option label="无" value="1"></el-option> -->
            <el-option v-for="(item,index) in pnames" :key="index" :label="item.name" :value="item.id"></el-option>
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
          name: '',
          code:'',
          group_id:''
        },
        pnames:[],
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
          limit: this.limit
        };
        param = Object.assign(param,this.filter)
        console.log(param)
        getDevice(param).then(res => {
          this.listLoading = false
          this.list = res.data.data
          this.total = res.data.total
          this.pnames= res.data.pnames
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
       * 设备编辑
       */
      deviceEdit(data) {
        this.dialogFormVisible = true
        this.deviceForm = {
          ...data
        }
        if(this.deviceForm.group_id == 0 ){
          this.deviceForm.group_id = '无'
        }
      },
      /**
       * 更新设备状态
       */
      changeStatus(status, data) {
        updateStatus({
          code: data.code,
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
            if (res.code == 200) {
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
