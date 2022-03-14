<template>
  <div class="app-container1" style="margin-top: 15px;">
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="#" type="index" align="center" :index="indexMethod" />
      <el-table-column label="分组名称" width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '无' }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="上级分组" width="220" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.pname.length >0 ? '' :'info'">{{ scope.row.pname.length >0 ? scope.row.pname[0].name : '无' }}</el-tag>
        </template>
      </el-table-column> -->
      <el-table-column class-name="status-col" label="设备数量" width="200" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.app_count}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="320">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="updated_at" label="更新时间" width="320">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
    </div>

    <!-- 添加设备组 -->
    <el-dialog :title="isEdit ? '编辑设备组' :'添加设备组'" @close="dialogClose" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="deviceGroupForm" ref="deviceGroupForm" label-width="100px">
        <el-form-item label="分组名称" required :rules="[{required:true,message:'分组名称不能为空'}]" prop="name"
          style="width: 70%;">
          <el-input v-model="deviceGroupForm.name" autocomplete="on"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上级分组" required prop="pid" :rules="[{required:true,message:'请选择上级分组'}]" style="width: 50%;">
          <el-select requie v-model="deviceGroupForm.pid" placeholder="请选择分组">
            <el-option label="无" value="0"></el-option>
            <el-option v-for="(item,index) in pnames" v-show="item.id != deviceGroupForm.id" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="submitForm('deviceGroupForm')">提 交</el-button>
          <el-button @click="resetForm('deviceGroupForm')">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getAppGroup,addAppGroup,deleteAppGroup,updateAppGroup
  } from '@/api/group.js'
  import Pagination from '@/components/Pagination'

  export default {
    components: {
      Pagination
    },
    props: {
      isAddGroup: ''
    },
    watch: {
      isAddGroup(v) {
        this.isEdit=false
        this.dialogFormVisible = true
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
          name: '',
          code: '',
          group: ''
        },
        isEdit:false,
        dialogFormVisible: false,
        deviceGroupForm: {},
        pnames:[]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      submitForm() {
        this.$refs.deviceGroupForm.validate((valid) => {
          if (valid) {
            this.isEdit ? this.toUpdateGroup() : this.toAddDeviceGroup();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getList() {
        this.listLoading = true
        let param = {
          page: this.page,
          limit: this.limit,
        };
        param = Object.assign(param, this.filter)
        getAppGroup(param).then(res => {
          this.listLoading = false
          this.list = res.data.data
          this.pnames= res.data.pnames;
          this.total = res.data.total
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
      handleEdit(data) {
        this.dialogFormVisible = true
        this.isEdit=true
        this.deviceGroupForm = {
          ...data
        }
        if(this.deviceGroupForm.pid == 0 ){
          this.deviceGroupForm.pid = '无'
        }
      },
      //弹框关闭回调
      dialogClose(){
        this.deviceGroupForm={}
      },
      /**
       * 添加设备分组
       */
      toAddDeviceGroup() {
        addAppGroup(this.deviceGroupForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '设备组添加成功！',
              type: 'success'
            });
            this.getList()
            this.dialogFormVisible=false
          }
        })
      },
      //更新设备组
      toUpdateGroup(){
        updateAppGroup(this.deviceGroupForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '数据更新成功！',
              type: 'success'
            });
            this.dialogFormVisible=false
            this.getList()
          }
        })
      },
      resetForm(formName) {
        // this.$refs[formName].resetFields();
        this.dialogFormVisible={}
        this.dialogFormVisible=false
      },
      /**
       * 设备删除
       */
      handleDelete(data) {
        this.$confirm('确定删除该分组吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAppGroup(data.id).then(res => {
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
      },

    }
  }
</script>
