<template>
  <div v-loading="loading" class="app-container">
    <!-- 门诊和急诊选项卡开始 -->
    <el-card style="margin-bottom: 5px;text-align: center">
      <el-radio-group v-model="schedulingType" @change="schedulingTypeChange">
        <el-radio-button
          v-for="dict in schedulingTypeOptions"
          :key="dict.dictValue"
          :label="dict.dictValue"
          :value="dict.dictValue"
        >
          {{ dict.dictLabel }}
        </el-radio-button>
      </el-radio-group>
    </el-card>
    <!-- 门诊和急诊选项卡结束 -->

    <!-- 底层卡片开始 -->
    <el-row :gutter="5">
      <!-- 左边患者信息开始 -->
      <el-col :span="7">
        <el-card>
          <el-form ref="form" :model="patientAllObj.patientObj" :inline="true" label-width="88px">
            <el-form-item label="患者姓名" prop="name">
              <el-input
                v-model="patientAllObj.patientObj.name"
                placeholder="请输入患者姓名"
                :disabled="true"
                style="width: 100%"
                size="small"
              >
                <el-button slot="append" icon="el-icon-user-solid" @click="viewRegistration" />
              </el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="cardNumber">
              <el-input
                v-model="patientAllObj.patientObj.cardNumber"
                placeholder="请输入身份证号"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者电话" prop="phone">
              <el-input
                v-model="patientAllObj.patientObj.phone"
                placeholder="请输入患者电话"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="patientAllObj.patientObj.sex">
                <el-radio
                  v-for="d in sexOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                  :disabled="true"
                >
                  {{ d.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="patientAllObj.patientObj.birthday"
                style="width: 100%"
                size="small"
                :disabled="true"
                value-format="yyyy-MM-dd"
                type="date"
              />
            </el-form-item>
            <el-form-item label="患者年龄" prop="age">
              <el-input
                v-model="patientAllObj.patientObj.age"
                placeholder="请输入患者年龄"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者地址" prop="address">
              <el-input
                v-model="patientAllObj.patientObj.address"
                placeholder="请输入患者地址"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="过敏信息" prop="allergyInfo">
              <el-input
                v-model="patientAllObj.patientObj.allergyInfo"
                placeholder="请输入过敏信息"
                type="textarea"
                :autosize="{ minRows: 2, maxRows:4 }"
                :disabled="true"
                maxlength="200"
                show-word-limit
                style="width: 100%"
                size="small"
              />
            </el-form-item>
          </el-form>
          <el-tabs :stretch="true" type="card">
            <el-tab-pane label="患者档案">
              <div v-if="patientAllObj.patientObj.isFinal === '1'">
                <div class="item">
                  紧急联系人:<span v-text="patientAllObj.patientFileObj.emergencyContactName" />
                </div>
                <div class="item">
                  紧急联系人电话:<span v-text="patientAllObj.patientFileObj.emergencyContactPhone" />
                </div>
                <div class="item">
                  紧急联系人关系:<span v-text="patientAllObj.patientFileObj.emergencyContactRelation" />
                </div>
                <div class="item">
                  左耳听力:<span v-text="patientAllObj.patientFileObj.leftEarHearing" />
                </div>
                <div class="item">
                  右耳听力:<span v-text="patientAllObj.patientFileObj.rightEarHearing" />
                </div>
                <div class="item">
                  左眼视力:<span v-text="patientAllObj.patientFileObj.leftVision" />
                </div>
                <div class="item">
                  右眼视力:<span v-text="patientAllObj.patientFileObj.rightVision" />
                </div>
                <div class="item">
                  身高:<span v-text="patientAllObj.patientFileObj.height" />
                </div>
                <div class="item">
                  体重:<span v-text="patientAllObj.patientFileObj.weight" />
                </div>
                <div class="item">
                  血型:<span v-text="patientAllObj.patientFileObj.bloodType" />
                </div>
                <div class="item">
                  个人史:<span v-text="patientAllObj.patientFileObj.personalInfo" />
                </div>
                <div class="item">
                  家族史:<span v-text="patientAllObj.patientFileObj.familyInfo" />
                </div>
                <div class="item">
                  档案创建时间:<span v-text="patientAllObj.patientFileObj.createTime" />
                </div>
                <div class="item">
                  档案更新时间:<span v-text="patientAllObj.patientFileObj.updateTime" />
                </div>
              </div>
              <div v-else style="text-align: center">
                暂无患者档案信息
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史病历">
              <div v-if="patientAllObj.careHistoryObjList.length > 0">
                <el-collapse accordion>
                  <el-collapse-item v-for="(item, index) in patientAllObj.careHistoryObjList" :key="index">
                    <template slot="title">
                      就诊部门：【 {{ item.deptName }} 】  就诊时间：{{ item.visitDate }}
                    </template>
                    <div class="item">
                      主诉：{{ item.caseTitle }}
                    </div>
                    <div class="item">
                      发病日期：{{ item.caseDate }}
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
                    <div class="item">
                      接诊类型：{{ item.receiveType === '0' ? '初诊' : '复诊' }}
                    </div>
                    <div class="item">
                      是否传染：{{ item.isContagious === '0' ? '否' : '是' }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else style="text-align: center">
                暂无历史病历信息
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 左边患者信息结束 -->

      <!-- 右边接诊信息开始 -->
      <el-col :span="17">
        <el-card>
          <el-row :gutter="5">
            <el-col :span="12">
              挂号单号：
              <span v-if="careHistory.regId === undefined" style="color: red;font-weight: bold">选择患者后显示</span>
              <span v-else style="color: blue">{{ careHistory.regId }}</span>
              <br>
              病历编号：
              <span style="color: red;font-weight: bold">保存病历后显示</span>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" :disabled="careHistory.regId === undefined" icon="el-icon-check">保存病历</el-button>
              <el-button type="danger" :disabled="careHistory.regId === undefined" icon="el-icon-finished">完成就诊</el-button>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- 右边接诊信息结束 -->
    </el-row>
    <!-- 底层卡片结束 -->

    <!-- 选择患者对话框开始 -->
    <el-dialog
      title="请选择挂号患者"
      :visible.sync="openRegistration"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <el-tabs v-model="activeName" :stretch="true" type="card" @tab-click="handleRegistrationTabClick">
        <el-tab-pane label="待就诊列表" name="t1">
          <el-table v-loading="tableLoading" border :data="toBeSeenRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleVisit(scope.row)">接诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊中列表" name="t2">
          <el-table v-loading="tableLoading" border :data="visitingRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊完成列表" name="t3">
          <el-table v-loading="tableLoading" border :data="visitCompletedRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">再次载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 选择患者对话框结束 -->
  </div>
</template>

<script>
import { queryToBeSeenRegistration, queryVisitingRegistration, queryVisitCompletedRegistration, receivePatient, getPatientAllMessageByPatientId } from '@/api/doctor/care'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 对话框遮罩层
      tableLoading: false,
      // 选项卡默认值
      schedulingType: '1',
      // 挂号类型数据
      schedulingTypeOptions: [],
      // 性别数据
      sexOptions: [],
      // 左边患者数据
      patientAllObj: {
        patientObj: {},
        patientFileObj: {},
        careHistoryObjList: []
      },
      // 病历信息
      careHistory: {},
      // 是否打开挂号患者列表对话框
      openRegistration: false,
      // 当前选中挂号列表选项卡
      activeName: 't1',
      // 待就诊数据
      toBeSeenRegistration: [],
      // 就诊中数据
      visitingRegistration: [],
      // 就诊完成数据
      visitCompletedRegistration: []
    }
  },
  created() {
    // 加载排班类型
    this.getDictDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
  },
  methods: {
    schedulingTypeChange(value) {
      this.schedulingType = value
    },
    // 挂号类型转换
    schedulingTypeFormatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType)
    },
    // 打开挂号患者列表的弹出层
    viewRegistration() {
      this.activeName = 't1'
      this.openRegistration = true
      this.queryToBeSeenRegistration()
    },
    // 挂号列表对话框选项卡change事件
    handleRegistrationTabClick(tab, event) {
      if (tab.name === 't1') {
        this.queryToBeSeenRegistration()
      } else if (tab.name === 't2') {
        this.queryVisitingRegistration()
      } else if (tab.name === 't3') {
        this.queryVisitCompletedRegistration()
      }
    },
    // 查询待就诊的挂号列表数据
    queryToBeSeenRegistration() {
      this.tableLoading = true
      queryToBeSeenRegistration(this.schedulingType).then(res => {
        this.toBeSeenRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊中的挂号列表数据
    queryVisitingRegistration() {
      this.tableLoading = true
      queryVisitingRegistration(this.schedulingType).then(res => {
        this.visitingRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊完成的挂号列表数据
    queryVisitCompletedRegistration() {
      this.tableLoading = true
      queryVisitCompletedRegistration(this.schedulingType).then(res => {
        this.visitCompletedRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 接诊
    handleVisit(row) {
      this.careHistory.regId = row.id
      const patientId = row.patientId
      this.loading = true
      this.openRegistration = false
      receivePatient(this.careHistory.regId).then(res => {
        this.loading = false
        this.msgSuccess('接诊成功')
        // 根据患者ID查询患者信息、患者档案信息、病历信息
        getPatientAllMessageByPatientId(patientId).then(res => {
          this.patientAllObj.patientObj = res.data.patient
          this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
          this.patientAllObj.patientFileObj = res.data.patientFile
          this.patientAllObj.careHistoryObjList = res.data.careHistoryList
          this.loading = false
        }).catch(() => {
          this.msgError('查询患者信息失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgError('接诊失败')
        this.loading = false
      })
    },
    // 载入
    handleLoading(row) {
      this.careHistory.regId = row.id
      const patientId = row.patientId
      this.openRegistration = false
      getPatientAllMessageByPatientId(patientId).then(res => {
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryObjList = res.data.careHistoryList
        this.loading = false
      }).catch(() => {
        this.msgError('载入失败')
        this.loading = false
      })
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
