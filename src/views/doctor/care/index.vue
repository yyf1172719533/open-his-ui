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
              <div v-if="patientAllObj.patientFileObj.isFinal === '1'">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 遮罩层
      loading: false,
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
      careHistory: {}
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
    // 打开挂号患者列表的弹出层
    viewRegistration() {
      //
    }
  }
}
</script>

<style scoped>

</style>
