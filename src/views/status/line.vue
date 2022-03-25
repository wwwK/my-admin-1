<template>
  <div>
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
      <el-table-column label="使用者" width="150" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.name || '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" width="100" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.line }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <div v-if="lineStatus[scope.$index]">
            <img :src="root+'/icons/'+lineStatus[scope.$index].status.icon" style="width: 25px;">
            <p style="margin:  0;font-size: 12px;line-height: 1;">{{lineStatus[scope.$index].status.text}}</p>
          </div>
          <div v-else>
            <img :src="root+'/icons/'+scope.row.status.icon" style="width: 25px;">
            <p style="margin:  0;font-size: 12px;line-height: 1;">{{scope.row.status.text}}</p>
          </div>
          <!-- <img v-if="scope.row.status && scope.row.status.status==1" style="width: 35px;" src="@/assets/images/online.png" >
          <img v-else style="width: 32px;" src="@/assets/images/off.png" > -->
        </template>
      </el-table-column>
      <el-table-column label="分机号码" width="180" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.tel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="来电记录" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.laidian }}
        </template>
      </el-table-column>
      <el-table-column label="去电记录" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.qudian }}
        </template>
      </el-table-column>
      <el-table-column label="未接来电" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.weijie }}
        </template>
      </el-table-column>
      <el-table-column label="通话时长(秒)" width="130" align="center">
        <template slot-scope="scope">
          {{ scope.row.call_duration }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="最后在线时间" width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.updated_at || '无'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" plain @click="LineEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: right;">
      <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
    </div>
    <!-- 编辑 -->
    <el-dialog title="编辑设备" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="LineForm" label-width="100px">
        <el-form-item label="名称" style="width: 70%;">
          <el-input v-model="LineForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="号码" style="width: 70%;">
          <el-input v-model="LineForm.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" style="width: 30%;">
          <el-input v-model="LineForm.line" disabled autocomplete="off"></el-input>
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
    getDeviceLine,updateDeviceLine,getLineStatus
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
        lineIds:[],
        lineStatus:[],
        listLoading: true,
        root:'',
        filter: {
          name: ''
        },
        LineForm:{},
        timer:null,
        dialogFormVisible:false
      }
    },
    created() {
      this.root=process.env.VUE_APP_PATH
      this.getList()
      //轮询保持实时信息
      this.timer=setInterval(()=>{
        if(this.$route.path=='/status/device/line'){
          this.getLineStatus()
        }
      },1500)
    },
    methods: {
      getList(isLoading=true) {
        if(isLoading){
          this.listLoading = true
        }
        getDeviceLine({
          page: this.page,
          limit: this.limit,
          code:this.$route.query.code
        }).then(res => {
          this.list = res.data.data
          this.lineIds = this.list.map((item)=>{
            return item.id;
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
      //提交端口编辑的表单
      submitEditForm() {
        this.dialogFormVisible = false
        updateDeviceLine(this.LineForm).then(res => {
          if (res.code == 200) {
            this.$message({
              message: '数据更新成功！',
              type: 'success'
            });
            this.getList()
          }
        })
      },
      //端口编辑
      LineEdit(data) {
        console.log(data)
        this.dialogFormVisible = true
        this.LineForm = {
          ...data
        }
        if(this.LineForm.group_id == 0 ){
          this.LineForm.group_id = '无'
        }
      },
      handleCurrentChange(val) {
        this.page = val
        this.getList(this.page)
      },
      indexMethod(index) {
        return index + 1 + (this.page - 1) * this.limit;
      },
      getLineStatus(){
        getLineStatus({
          code:this.$route.query.code,
          lineIds:this.lineIds
        }).then(res=>{
          this.lineStatus=res.data
        })
      }
    },
    beforeDestroy() {
      if(this.timer){
        clearInterval(this.timer)
      }
    }
  }
</script>
