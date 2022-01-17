<template>
  <div class="app-container" style="margin-top: 15px;">
    <div style="margin-bottom: 5px;">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addRole">添加角色</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="#" type="index" align="center" :index="indexMethod" />
      <el-table-column label="角色名称" width="300" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限" width="300" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="selectAuthBtn(scope.$index)">查看权限</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="departmentEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
    </div>
    <!-- 查看权限 -->
    <el-dialog v-if="dialogAuthVisible" title="查看权限" :visible.sync="dialogAuthVisible" width="30%">
      <div style="margin-top: 10px">
        <el-checkbox-group v-model="authList" size="small">
          <el-checkbox v-for="(item,index) in permissions" :label="item.cn_name" :key="item.id"
            border></el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAuth(role_id)">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹框表单 -->
    <el-dialog :title="isAddForm?'添加角色':'编辑角色'" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="roleForm" label-width="100px">
        <el-form-item label="角色名称" style="width: 70%;">
          <el-input v-model="roleForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="isAddForm" type="primary" @click="submitAddForm">确 定</el-button>
        <el-button v-else type="primary" @click="submitEditForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getRole,
    addRole,
    delRole,
    updateRole,updateRolePermission
  } from '@/api/account.js'
  import Pagination from '@/components/Pagination'

  export default {
    components: {
      Pagination
    },
    data() {
      return {
        total: 10,
        page: 1,
        limit: 20,
        list: null,
        listLoading: true,
        authVisible: false,
        dialogAuthVisible: false,
        permissions: [],
        authList: [],
        role_id:null,
        dialogFormVisible: false,
        isAddForm: false,
        roleForm: {},
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
        param = Object.assign(param, this.filter)
        getRole(param).then(res => {
          this.permissions = res.data.permissions
          this.listLoading = false
          this.list = res.data.data
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
      selectAuthBtn(index) {
        this.dialogAuthVisible = true;
        let permissions = this.list[index].permissions;
        this.role_id=this.list[index].id
        this.authList = permissions.map(item => {
          return item.cn_name;
        })
      },
      saveAuth(role_id) {
        if(role_id){
          updateRolePermission({'role_id':role_id,'permissions':this.authList}).then(res=>{
            console.log(res.data)
            if (res.code == 200) {
              this.dialogAuthVisible = false;
              this.$message({
                message: '权限保存成功！',
                type: 'success'
              });
              this.getList()
            }
          })
        }
      },
      //部门编辑
      departmentEdit(data) {
        this.isAddForm = false
        this.dialogFormVisible = true
        this.roleForm = {
          ...data
        }
      },
      //角色添加
      addRole() {
        this.roleForm = {}
        this.isAddForm = true
        this.dialogFormVisible = true
      },
      submitAddForm() {
        this.dialogFormVisible = false
        addRole(this.roleForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '角色创建成功！',
              type: 'success'
            });
            this.getList()
          }
        }).catch(err => {
          console.log(err)
        })
      },
      /**
       * 提交编辑的表单
       */
      submitEditForm() {
        this.dialogFormVisible = false
        console.log(this.roleForm)
        updateRole(this.roleForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '信息更新成功！',
              type: 'success'
            });
            this.getList()
          }
        })
      },
      /**
       * 角色删除
       */
      handleDelete(data) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delRole(data.id).then(res => {
            if (res.code == 200) {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        })
      }

    }
  }
</script>
