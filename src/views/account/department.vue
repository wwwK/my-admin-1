<template>
  <div class="app-container" style="margin-top: 15px;">
    <div style="margin-bottom: 5px;">
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addDepartment">添加新部门</el-button>
    </div>

    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="#" type="index" align="center" :index="indexMethod" />
      <el-table-column label="部门名称" width="280" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号数量" width="200" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.account_count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机权限" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="selectAppAuth(scope.row)">选择手机设备</el-button>
          <!-- <span>{{ scope.row.code }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="设备权限" width="250" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="info" plain @click="selectAuth(scope.row)">选择设备权限</el-button>
          <!-- <span>{{ scope.row.code }}</span> -->
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
    <!-- 选择手机设备 -->
    <el-dialog title="选择手机设备" :visible.sync="authAppVisible" width="30%">
      <div>
        <table class="table" style="width: 100%;" border="1" cellspacing="0" cellpadding="">
          <thead>
            <tr>
              <th style="width: 15%;padding: 5px;">设备组</th>
              <th>设备</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in appLists" :key="index">
              <td><el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{item.name}}</el-checkbox></td>
              <td>
                <el-checkbox-group v-model="item.list" @change="handleCheckedCitiesChange">
                  <el-checkbox v-for="(item) in item.list" :label="city" :key="city">{{city}}</el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td>Data</td>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="buttons" style="margin-top: 15px;">
        <el-button size="medium" type="primary" @click="saveAuth">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 选择设备权限 -->
    <el-dialog title="选择设备权限" :visible.sync="authVisible" width="30%">
      <el-tree v-if="authVisible" :data="data" ref="tree" show-checkbox :default-checked-keys="selfAuth" node-key="id"
        :expand-on-click-node="false" :props="{'children':'device_line','label':'id'}">
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{data.label}}</span>
          <!-- <span v-if="data.id">{{ data.id }}{{data.name ? '（'+data.name+'）':''}}</span>
            <span v-else>{{ data.line }}（{{data.name || data.tel}}）</span> -->
        </div>
      </el-tree>

      <div class="buttons" style="margin-top: 15px;">
        <!-- <el-button @click="getCheckedNodes">通过 node 获取</el-button>
        <el-button @click="getCheckedKeys">通过 key 获取</el-button>
        <el-button @click="setCheckedNodes">通过 node 设置</el-button>
        <el-button @click="setCheckedKeys">通过 key 设置</el-button>
        <el-button @click="resetChecked">清空</el-button> -->
        <el-button size="medium" type="primary" @click="saveAuth">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹框表单 -->
    <el-dialog :title="isAddForm?'添加新部门':'编辑部门'" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="departmentForm" label-width="100px">
        <el-form-item label="部门名称" style="width: 70%;">
          <el-input v-model="departmentForm.name" autocomplete="off"></el-input>
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
    getDepartment,
    addDepartment,
    delDepartment,
    updateDepartment
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
        authAppVisible: false,
        dialogFormVisible: false,
        isAddForm: false,
        departmentForm: {},
        selfAuth: '',
        department_id: null,
        data: [],
        appLists: [{
          group_id: 1,
          name: '哈哈',
          list: [{
              id: 1,
              name: '15937586268',
              tel: '100'
            },
            {
              id: 1,
              name: '15937586268',
              tel: '100'
            },
            {
              id: 1,
              name: '15937586268',
              tel: '100'
            },
          ]
        }, {
          group_id: 2,
          name: '哈哈',
          list: [{
              id: 1,
              name: '15937586268',
              tel: '100'
            },
            {
              id: 1,
              name: '15937586268',
              tel: '100'
            },
            {
              id: 1,
              name: '15937586268',
              tel: '100'
            },
          ]
        }]
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
        getDepartment(param).then(res => {
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
      //选择手机设备
      selectAppAuth(data) {
        this.selfAuth = JSON.parse(data.self_auth) ?? []
        this.department_id = data.id
        this.authAppVisible = true
      },
      //选择设备权限
      selectAuth(data) {
        this.selfAuth = JSON.parse(data.self_auth) ?? []
        this.department_id = data.id
        this.authVisible = true
      },
      saveAuth() {
        let device_auth = this.$refs.tree.getCheckedKeys();
        updateDepartment({
          id: this.department_id,
          device_auth: device_auth
        }).then(res => {
          if (res.code == 200) {
            this.authVisible = false
            this.$message({
              message: '权限保存成功！',
              type: 'success'
            });
            this.getList()
          }
        })
      },
      //部门编辑
      departmentEdit(data) {
        this.isAddForm = false
        this.dialogFormVisible = true
        this.departmentForm = {
          ...data
        }
      },
      //部门添加
      addDepartment() {
        this.departmentForm = {}
        this.isAddForm = true
        this.dialogFormVisible = true
      },
      submitAddForm() {
        this.dialogFormVisible = false
        addDepartment(this.departmentForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '部门创建成功！',
              type: 'success'
            });
            this.getList()
          }
        })
      },
      /**
       * 提交编辑的表单
       */
      submitEditForm() {
        this.dialogFormVisible = false
        updateDepartment(this.departmentForm).then(res => {
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
       * 部门删除
       */
      handleDelete(data) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDepartment(data.id).then(res => {
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
