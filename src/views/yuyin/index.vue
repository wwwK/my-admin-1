<template>
  <div class="device-call">
    <!-- 筛选查询 -->
    <div class="filter-container">
      <el-form :inline="true" :model="filter" ref="filter" label-position="left" label-width="80px"
        class="demo-form-inline">
        <el-form-item label="关键词" prop="keyword" label-width="80px" style="margin-right: 30px;">
          <el-input v-model="filter.keyword" placeholder="关键词"></el-input>
        </el-form-item>
        <div>
          <el-form-item label="录音日期" prop="date">
            <el-date-picker v-model="filter.date" value-format="yyyy-MM-dd" type="daterange" range-separator="至"
              start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="medium" @click="onSelect">检索</el-button>
          <!-- <el-button size="medium" @click="resetForm('filter')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="app-container">
      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" fit highlight-current-row>
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="#" type="index" align="center" :index="indexMethod" />
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
        <el-table-column label="语音转写" min-width="200" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.text" placement="top-start">
              <p class="txt-line2">{{ scope.row.text }}</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" min-width="150" label="日期时间">
          <template slot-scope="scope">
            <span>{{ scope.row.call_time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <div style="">
              <el-button size="mini" style="margin: 5px 0 5px 10px;" type="success" @click="playRecord(scope.row)">播放
              </el-button>
              <el-button v-if="permissions.indexOf('call.download')!=-1" size="mini" type="primary"
                @click="downloadFile(scope.row.file)">下载</el-button>
              <!-- <el-button size="mini" type="warning" @click="playRecord(scope.row.file,scope.row.id)">详情</el-button> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;">
        <pagination v-show="total>0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="getList" />
      </div>
      <!-- 检查结果弹窗 -->
      <el-dialog title="检索报告" v-if="resVisible" :visible.sync="resVisible" width="30%">
        <p>关键词：<span style="color: #0000FF;">{{filter.keyword}}</span></p>
        <p>共检索了 {{countData.total}} 条记录。</p>
        <p style="font-weight: bold;margin: 20px 0;font-size: 15px;">其中命中关键词的有：</p>
        <p>来电记录：{{countData.laidian || 0}} 条</p>
        <p>去电记录：{{countData.qudian || 0}} 条</p>
        <p>未接记录：{{countData.weijie || 0}} 条</p>
        <p>总计：{{countData.call_total || 0}} 条</p>
        <p>命中率：{{countData.percent}}</p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resVisible = false">取 消</el-button>
          <el-button type="primary" @click="listShow">详 情</el-button>
        </span>
      </el-dialog>
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
    getAudioText,
    download
  } from '@/api/call.js'
  import {
    getAudio,getAudioCount
  } from '@/api/audio.js'
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
          date: '',
          keyword: '',
        },
        permissions: [],
        resVisible:false,
        countData:[],
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
    },
    methods: {
      getList() {
        let param = {
          page: this.page,
          limit: this.limit
        };
        param = Object.assign(param, this.filter)
        this.listLoading = true
        getAudio(param).then(res => {
          this.listLoading = false
          if (res.code == 200) {
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
        if (!this.filter.keyword) {
          this.$message('请输入关键词');
        } else {
          this.resVisible=true
          getAudioCount(this.filter).then(res => {
            this.listLoading = false
            if (res.code == 200) {
              this.countData=res.data[0]
              console.log(this.countData)
            }
            setTimeout(() => {
              this.listLoading = false
            }, 1.5 * 1000)
          })
        }
      },
      //展示列表
      listShow(){
        this.resVisible=false
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
      resetForm(formName) {
        console.log(this.$refs[formName])
        this.$refs[formName].resetFields();
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
