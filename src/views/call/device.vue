<template>
  <div class="device-call">
    <!-- 筛选查询 -->
    <div class="filter-container">
      <el-form :inline="true" :model="filter" ref="filter" class="demo-form-inline">
        <el-form-item label="设备名称" prop="name" style="margin-right: 30px;">
          <el-input v-model="filter.name" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备分组" prop="group" style="margin-right: 30px;">
          <el-select requie v-model="filter.group_id" placeholder="请选择分组">
            <el-option label="无" value="0"></el-option>
            <el-option v-for="(item,index) in pnames" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备编码" prop="code" style="margin-right: 30px;">
          <el-input v-model="filter.code" placeholder="请输入设备编码"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="对方号码" prop="tel" style="margin-right: 30px;">
            <el-input v-model="filter.tel" placeholder="请输入号码"></el-input>
          </el-form-item>
          <el-form-item label="录音类型" prop="type" style="margin-right: 30px;">
            <el-select v-model="filter.type" placeholder="请选择">
              <el-option label="去电记录" value="9"></el-option>
              <el-option label="来电记录" value="10"></el-option>
              <el-option label="未接来电" value="11"></el-option>
              <el-option label="现场录音" value="28"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分机号码" prop="tel" style="margin-right: 30px;">
            <el-input v-model="filter.self_tel" placeholder="请输入号码"></el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="录音日期" prop="date">
            <el-date-picker v-model="filter.date" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item v-if="permissions.indexOf('call.other_tel')!=-1" label="外部号码" prop="tel" style="margin-right: 30px;">
            <el-input v-model="filter.other_tel" placeholder="请输入号码"></el-input>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="onSelect">搜索</el-button>
          <el-button size="medium" @click="resetForm('filter')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="app-container">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="#" type="index" align="center" :index="indexMethod" />
        <!-- <el-table-column align="center" label="#" width="95">
          <template slot-scope="scope">
            {{ scope.$index+1 + (page-1)*limit }}
          </template>
        </el-table-column> -->
        <el-table-column label="设备名称" width="140" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name || '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编码" min-width="120" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.device_code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分机号码" align="center">
          <template slot-scope="scope">
            {{ scope.row.line_tel || '未知'}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="录音类型" width="180" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.type ==9" class="type_div">
              <svg-icon icon-class="qudian" />
              <p style="">去电记录</p>
            </div>
            <div v-else-if="scope.row.type ==10" class="type_div">
              <svg-icon icon-class="laidian" />
              <p style="">来电记录</p>
            </div>
            <div v-else-if="scope.row.type ==11" class="type_div">
              <svg-icon icon-class="weijie" />
              <p style="">未接来电</p>
            </div>
            <div v-else-if="scope.row.type ==28" class="type_div">
              <svg-icon icon-class="type28" />
              <p style="">现场录音</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="录音时长" align="center">
          <template slot-scope="scope">
            {{ scope.row.recording_duration }}
          </template>
        </el-table-column>
        <el-table-column label="对方号码" align="center">
          <template slot-scope="scope">
            {{ scope.row.tel }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" min-width="150" label="日期时间">
          <template slot-scope="scope">
            <span>{{ scope.row.call_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.file" style="">
              <el-button v-if="permissions.indexOf('call.play')!=-1" size="mini" style="margin: 5px 0 5px 10px;" type="success" @click="playRecord(scope.row)">播放</el-button>
              <el-button v-if="permissions.indexOf('call.download')!=-1" size="mini" type="primary" @click="downloadFile(scope.row.file)">下载</el-button>
              <el-button v-if="permissions.indexOf('call.switch')!=-1" size="mini" type="warning" @click="switchFile(scope.row.file,scope.row.id)">转换</el-button>
              <el-button v-if="permissions.indexOf('call.delete')!=-1" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </div>
            <div v-else>
              <el-tooltip v-if="permissions.indexOf('call.play')!=-1" style="margin: 5px 0 5px 10px;" class="item" effect="dark" content="无录音文件" placement="top-start">
                <el-button size="mini" type="info">播放</el-button>
              </el-tooltip>
              <el-tooltip v-if="permissions.indexOf('call.download')!=-1" class="item" effect="dark" content="无录音文件" placement="top-start">
                <el-button size="mini" type="info">下载</el-button>
              </el-tooltip>
              <el-tooltip v-if="permissions.indexOf('call.switch')!=-1" class="item" effect="dark" content="无录音文件" placement="top-start">
                <el-button size="mini" type="info">转换</el-button>
              </el-tooltip>
              <el-button v-if="permissions.indexOf('call.delete')!=-1" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;">
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
      </div>
      <!-- 音频播放弹窗 -->
      <el-dialog v-if="playDialogVisible" :title=" '正在播放 - '+playDialog.title" :visible.sync="playDialogVisible">
        <div :key="playDialog.file">
          <VuePlyr ref="plyr" :options="options">
            <audio controls crossorigin playsinline>
              <source :src="playDialog.file" />
              <!-- <source src="http://cdn.xfrec.com/3.mp3" type="audio/mp3" /> -->
            </audio>
          </VuePlyr>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="playDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="playDialogVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getDeviceCall,
    delDeviceCall,
    getAudioText,download
  } from '@/api/call.js'
  import Pagination from '@/components/Pagination'
  import VuePlyr from 'vue-plyr'
  import 'vue-plyr/dist/vue-plyr.css'

  export default {
    components: {
      Pagination,
      VuePlyr
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
        listLoading: false,
        filter: {
          name: '',
          date: '',
          tel: '',
          code: '',
          type: '',
          group_id: '',
          other_tel:'',
          self_tel:''
        },
        pnames: [],
        permissions:[],
        playDialogVisible: false,
        playDialog: {},
        options: {
          i18n: {
            speed: '速度',
            normal: '正常'
          }
        },
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      let code = this.$route.query.code
      code ? this.filter.code = code : '';
      if(process.env.VUE_APP_CALL_AUTOLOAD){
        this.getList();
      }else{
        this.getList(false)
      }
    },
    methods: {
      getList(auto=true) {
        let param = {
          page: this.page,
          limit: this.limit
        };
        param = Object.assign(param, this.filter)
        this.listLoading = true
        getDeviceCall(param).then(res => {
          this.listLoading = false
          this.permissions=res.data.permissions
          if(auto){
            this.list = res.data.data
            this.pnames = res.data.pnames
            this.total = res.data.total
          }
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      handleCurrentChange(val) {
        this.page = val
        this.getList(this.page)
      },
      /**
       * 查询
       */
      onSelect() {
        this.getList()
      },
      /**
       * 播放
       */
      playRecord(data) {
        console.log(data)
        this.playDialogVisible = true
        this.playDialog.title = data.name ? data.name : data.device_code + ' - ' + data.tel
        this.playDialog.file = data.file
      },
      /**
       * 删除记录
       */
      handleDelete(data) {
        this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDeviceCall(data.id).then(res => {
            if (res.code == 200) {
              this.getList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            }
          })
        })
      },
      resetForm(formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields();
      },
      //语音转写
      switchFile(file,id) {
        this.$confirm('确定要将该录音转换成文字吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '正在转换中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          getAudioText({file:file,id:id}).then(res=>{
            console.log(res)
            loading.close()
            this.$alert(res.data.audioText,'转换结果',{
              'customClass':'switch-box'
            })
          }).catch(err=>{
            console.log(err)
            loading.close()
          })
        })
      },
      /**
       * 下载文件
       */
      downloadFile(file) {
        window.location.href = file
        // download({file:file}).then(res=>{
        //   console.log(res)
        // })
      },
      indexMethod(index) {
        return index + 1 + (this.page - 1) * this.limit;
      }
    }
  }
</script>
