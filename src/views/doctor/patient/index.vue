<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="患者名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入患者名称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号码"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="cardNumber">
        <el-input
          v-model="queryParams.cardNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" round icon="el-icon-plus" size="mini" :disabled="single" @click="handleViewFile">查看档案</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" round icon="el-icon-edit" size="mini" :disabled="single" @click="handleViewCareHistory">查看就诊病历</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="patientTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号码" align="center" prop="phone" />
      <el-table-column label="身份证号" align="center" prop="cardNumber" />
      <el-table-column label="出生年月" align="center" prop="birthday">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday.substring(0, 10) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center" prop="age" :formatter="calculateAgeFormatter" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormatter" />
      <el-table-column label="信息状态" align="center" prop="isFinal" :formatter="msgFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
    </el-table>
    <!-- 数据表格结束 -->

    <!-- 分页控件开始 -->
    <el-pagination
      v-show="total>0"
      :current-page="queryParams.pageNum"
      :page-sizes="[5,10,20,30]"
      :page-size="queryParams.pageSize"
      layout="total,sizes,prev,pager,next,jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 分页控件结束 -->

    <!-- 查看患者档案对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="fileOpen"
      width="1000px"
      center
      append-to-body
    >
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-form-item label="ID:">
          <span v-text="patientObj.id" />
        </el-form-item>
        <el-form-item label="姓名:">
          <span v-text="patientObj.name" />
        </el-form-item>
        <el-form-item label="身份证号:">
          <span v-text="patientObj.cardNumber" />
        </el-form-item>
        <el-form-item label="手机号码:">
          <span v-text="patientObj.phone" />
        </el-form-item>
        <el-form-item label="患者性别:">
          <span v-text="patientObj.sex" />
        </el-form-item>
        <el-form-item label="出生年月:">
          <span v-text="patientObj.birthday" />
        </el-form-item>
        <el-form-item label="地址:">
          <span v-text="patientObj.address" />
        </el-form-item>
        <el-form-item label="过敏信息:">
          <span v-text="patientObj.allergyInfo" />
        </el-form-item>
        <el-form-item label="信息是否完善:">
          <span v-text="patientObj.isFinal" />
        </el-form-item>
        <el-form-item label="最后登录IP:">
          <span v-text="patientObj.lastLoginIp" />
        </el-form-item>
        <el-form-item label="最后登录时间:">
          <span v-text="patientObj.lastLoginTime" />
        </el-form-item>
        <el-form-item label="创建时间:">
          <span v-text="patientObj.createTime" />
        </el-form-item>
        <el-form-item label="更新时间:">
          <span v-text="patientObj.updateTime" />
        </el-form-item>
        <el-form-item label="紧急联系人:">
          <span v-text="patientFileObj.emergencyContactName" />
        </el-form-item>
        <el-form-item label="紧急联系人电话:">
          <span v-text="patientFileObj.emergencyContactPhone" />
        </el-form-item>
        <el-form-item label="关系:">
          <span v-text="patientFileObj.emergencyContactRelation" />
        </el-form-item>
        <el-form-item label="左耳听力:">
          <span v-text="patientFileObj.leftEarHearing" />
        </el-form-item>
        <el-form-item label="右耳听力:">
          <span v-text="patientFileObj.rightEarHearing" />
        </el-form-item>
        <el-form-item label="左眼视力:">
          <span v-text="patientFileObj.leftVision" />
        </el-form-item>
        <el-form-item label="右眼视力:">
          <span v-text="patientFileObj.rightVision" />
        </el-form-item>
        <el-form-item label="身高:">
          <span v-text="patientFileObj.height" />
        </el-form-item>
        <el-form-item label="体重:">
          <span v-text="patientFileObj.weight" />
        </el-form-item>
        <el-form-item label="血型:">
          <span v-text="patientFileObj.bloodType" />
        </el-form-item>
        <el-form-item label="个人史:">
          <span v-text="patientFileObj.personalInfo" />
        </el-form-item>
        <el-form-item label="家族史:">
          <span v-text="patientFileObj.familyInfo" />
        </el-form-item>
        <el-form-item label="档案创建时间:">
          <span v-text="patientFileObj.createTime" />
        </el-form-item>
        <el-form-item label="档案更新时间:">
          <span v-text="patientFileObj.updateTime" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFile">取消</el-button>
      </span>
    </el-dialog>
    <!-- 查看患者档案对话框结束 -->

    <!-- 查看患者病历对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="careHistoryOpen"
      width="1000px"
      center
      append-to-body
    >
      <el-form label-position="left" label-width="120px" inline class="demo-table-expand">
        <el-card>
          <el-form-item label="ID:">
            <span v-text="patientObj.id" />
          </el-form-item>
          <el-form-item label="姓名:">
            <span v-text="patientObj.name" />
          </el-form-item>
          <el-form-item label="身份证号:">
            <span v-text="patientObj.cardNumber" />
          </el-form-item>
          <el-form-item label="电话:">
            <span v-text="patientObj.phone" />
          </el-form-item>
        </el-card>
      </el-form>
      <el-card style="margin-top:3px">
        <div v-if="allPatientMsg.length>0">
          <el-collapse accordion>
            <el-collapse-item
              v-for="(item,index) in allPatientMsg"
              :key="index"
              :name="index"
            >
              <template slot="title">
                科室：【{{ item.deptName }}】   就诊时间：【{{ item.visitDate }}】
              </template>
              <div class="item">
                主诉：{{ item.caseTitle }}
              </div>
              <div class="item">
                诊断信息：{{ item.caseResult }}
              </div>
              <div class="item">
                医生建议：{{ item.doctorTips }}
              </div>
              <div class="item">
                备注：{{ item.remark }}
              </div>
              <!--当前挂号单历史处方开始-->
              <el-collapse v-show="item.careOrders.length > 0" accordion>
                <el-collapse-item v-for="(it,i) in item.careOrders" :key="i">
                  <template slot="title">
                    【 {{ it.prescType === '0' ? '药品处方' : '检查处方' }}】【{{ i + 1 }}】 <span>【处方总额】:￥{{ it.amount }}</span>
                  </template>
                  <el-table
                    v-loading="loading"
                    border
                    :data="it.careOrderItems"
                  >
                    <el-table-column label="序号" align="center" type="index" width="50" />
                    <el-table-column :label="it.prescType === '0' ? '药品名称' : '项目名称'" align="center" prop="itemName" />
                    <el-table-column label="数量" align="center" prop="num" />
                    <el-table-column label="单价(元)" align="center" prop="singlePrice" />
                    <el-table-column label="金额(元)" align="center" prop="amount" />
                    <el-table-column label="备注" prop="remark" align="center" />
                    <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
                  </el-table>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div v-else style="text-align:center">
          暂无就诊数据
        </div>
      </el-card>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelHistory">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 查看患者病历对话框结束 -->
  </div>
</template>

<script>
import { listPatientForPage, getPatientById, getPatientFileById, getPatientAllMessageByPatientId } from '@/api/doctor/patient'

export default {
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 分页数据总条数
      total: 0,
      // 表格数据
      patientTableList: [],
      // 用户性别
      sexOptions: [],
      // 信息是否完善
      patientMsgOptions: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      fileOpen: false,
      // 患者病历对话框
      careHistoryOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: undefined,
        phone: undefined,
        cardNumber: undefined
      },
      // 患者信息
      patientObj: {},
      // 患者档案信息
      patientFileObj: {},
      // 患者所有就诊信息
      allPatientMsg: [],
      // 处方详情支付状态
      statusOptions: []
    }
  },
  created() {
    this.getPatientList()
    // 加载用户性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载信息完善状态
    this.getDictDataByType('his_patient_msg_final').then(res => {
      this.patientMsgOptions = res.data
    })
    // 加载处方详情支付状态
    this.getDictDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    getPatientList() {
      this.loading = true
      listPatientForPage(this.queryParams).then(res => {
        this.patientTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getPatientList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getPatientList()
    },
    // 数据表格多选时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getPatientList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getPatientList()
    },
    // 性别转换
    sexFormatter(row) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    // 年龄计算
    calculateAgeFormatter(row) {
      return this.getAge(row.birthday.substring(0, 10))
    },
    // 信息状态转换
    msgFormatter(row) {
      return this.selectDictLabel(this.patientMsgOptions, row.isFinal)
    },
    // 处方详情支付状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 查看患者档案
    handleViewFile() {
      const patientId = this.ids[0]
      this.fileOpen = true
      this.title = '查看患者档案信息'
      this.patientObj = {}
      this.patientFileObj = {}
      // 查询患者信息
      getPatientById(patientId).then(res => {
        this.patientObj = res.data
        const sex = this.patientObj.sex
        const isFinal = this.patientObj.isFinal
        this.patientObj.sex = (sex === '0' ? '男' : sex === '1' ? '女' : '未知')
        this.patientObj.isFinal = isFinal === '0' ? '未完善' : '已完善'
      })
      // 查询患者档案信息
      getPatientFileById(patientId).then(res => {
        if (res.data !== null) {
          this.patientFileObj = res.data
        }
      })
    },
    // 查看患者病历信息
    handleViewCareHistory() {
      this.careHistoryOpen = true
      this.title = '查看患者病历信息'
      const patientId = this.ids[0]
      this.patientFileObj = {}
      this.patientObj = {}
      this.allPatientMsg = []
      // 查询患者信息
      getPatientById(patientId).then(res => {
        this.patientObj = res.data
      })
      // 查询病历信息
      getPatientAllMessageByPatientId(patientId).then(res => {
        this.allPatientMsg = res.data
      }).catch(() => {
        this.msgError('查询失败')
      })
    },
    // 取消
    cancelFile() {
      this.fileOpen = false
      this.title = ''
    },
    cancelHistory() {
      this.careHistoryOpen = false
      this.title = ''
    }
  }
}
</script>

<style scoped>
.demo-table-expand {
    font-size: 0;
   }
 .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
   }
 .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
   }
.item{
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
