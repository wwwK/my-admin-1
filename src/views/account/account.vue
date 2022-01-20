<template>
  <div class="app-container" style="margin-top: 15px;">
    <div style="margin-bottom: 5px;">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addAccount">添加新账号</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="#" type="index" align="center" :index="indexMethod" />
      <el-table-column label="用户名" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" width="180" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.department" type="warning">{{ scope.row.department.name }}</el-tag>
          <el-tag v-else type="warning">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="180" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roles.length>0" type="success">{{ scope.row.roles[0].cn_name }}</el-tag>
          <el-tag v-else type="success">无</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.reg_time }}</span>
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
    <!-- 弹框表单 -->
    <el-dialog :title="isAddForm?'添加新账号':'编辑账号'" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="accountForm" ref="accountForm" label-width="100px">
        <el-form-item label="用户名" prop="username" :rules="[{required: true, message: '请输入登录用户名', trigger: 'blur'}]" style="width: 70%;">
          <el-input v-model="accountForm.username" :disabled="accountForm.username=='admin'" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" style="width: 70%;">
          <el-input v-model="accountForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="[{required: isAddForm, message: '请输入密码', trigger: 'blur'}]" style="width: 70%;">
          <el-input v-model="accountForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" style="width: 70%;">
          <el-input v-model="accountForm.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" style="width: 70%;">
          <el-input v-model="accountForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="确认密码" prop="password" :rules="[{required: true, message: '请输入登录用户名', trigger: 'blur'}]" style="width: 70%;">
          <el-input v-model="accountForm.password" autocomplete="off"></el-input>
        </el-form-item> -->
        <el-form-item label="部门" required prop="department_id" :rules="[{required:true,message:'请选择部门'}]"
          style="width: 50%;">
          <el-select requie v-model="accountForm.department_id" placeholder="请选择部门">
            <el-option label="无" :value="0"></el-option>
            <el-option v-for="(item,index) in departments" v-show="item.id != departments.id" :key="index"
              :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" required prop="role_id" :rules="[{required:true,message:'请选择角色'}]" style="width: 50%;">
          <el-select requie v-model="accountForm.role_id" placeholder="请选择角色">
            <el-option label="无" :value="0"></el-option>
            <el-option v-for="(item,index) in roles" v-show="item.id != roles.id" :key="index" :label="item.name"
              :value="item.id"></el-option>
          </el-select>
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
    getAccount,
    addAccount,
    delAccount,
    updateAccount
  } from '@/api/account.js'
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
          name: '',
          code: '',
          group_id: ''
        },
        pnames: [],
        authVisible: false,
        dialogFormVisible: false,
        isAddForm: false,
        accountForm: {},
        departments: {},
        roles: {},
        department_id: null,
        data: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      getList() {
        this.listLoading = true
        let param = {
          page: this.page,
          limit: this.limit
        };
        param = Object.assign(param, this.filter)
        getAccount(param).then(res => {
          this.departments = res.data.departments
          this.roles = res.data.roles
          this.data = res.data.device_line
          this.listLoading = false
          this.list = res.data.data
          this.total = res.data.total
          this.pnames = res.data.pnames
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
      //部门编辑
      departmentEdit(data) {
        this.isAddForm = false
        this.dialogFormVisible = true
        this.accountForm = {
          ...data
        }
        this.accountForm.role_id=data.roles[0].id
      },
      //部门添加
      addAccount() {
        this.accountForm = {}
        this.isAddForm = true
        this.dialogFormVisible = true
      },
      submitAddForm() {
        this.$refs['accountForm'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            addAccount(this.accountForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '账号创建成功！',
                  type: 'success'
                });
                this.getList()
              }
            }).catch(err => {
              console.log(err)
            })
          }
        });
      },
      /**
       * 提交编辑的表单
       */
      submitEditForm() {
        this.$refs['accountForm'].validate((valid) => {
          if (valid) {
            this.dialogFormVisible = false
            updateAccount(this.accountForm).then(res => {
              if (res.code == 200) {
                this.$message({
                  message: '信息更新成功！',
                  type: 'success'
                });
                this.getList()
              }
            })
          }
        });
      },
      /**
       * 部门删除
       */
      handleDelete(data) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delAccount(data.id).then(res => {
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
<style>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    padding-right: 8px;
  }

  /* .el-tree-node.is-expanded>.el-tree-node__children{
    display: flex!important;
    flex-wrap: wrap;
  } */
  /* .el-tree-node.is-expanded> .el-tree-node__content{
    float: left;
  } */
  /* .el-tree-node:focus>.el-tree-node__content{
    float: none;
  } */
</style>
