<template>
  <div class="app-container">
    <!-- 患者信息搜索开始 -->
    <el-card class="box-card" shadow="always" style="margin-bottom: 10px">
      <el-form ref="queryForm" :model="patientParams" label-width="70px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="身份证号" prop="cardNumber">
              <el-input
                v-model="patientParams.cardNumber"
                placeholder="请输入身份证号"
                clearable
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button size="mini" round type="warning" icon="el-icon-search" @click="handleLoadPatient">加载患者信息</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 患者信息搜索结束 -->

    <!-- 患者基本信息表单开始 -->
    <el-card class="box-card" shadow="always" style="margin-bottom: 10px">
      <el-form ref="form" :model="patientParams" :rules="rules" :inline="true" label-width="88px">
        <el-form-item label="身份证号" prop="cardNumber">
          <el-input
            v-model="patientParams.cardNumber"
            placeholder="请输入身份证号"
            clearable
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="患者姓名" prop="name">
          <el-input
            v-model="patientParams.name"
            placeholder="请输入患者姓名"
            clearable
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="患者电话" prop="phone">
          <el-input
            v-model="patientParams.phone"
            placeholder="请输入患者电话"
            clearable
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="patientParams.sex">
            <el-radio
              v-for="d in sexOptions"
              :key="d.dictValue"
              :label="d.dictValue"
              :value="d.dictValue"
            >{{ d.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生年月" prop="birthday">
          <el-date-picker
            v-model="patientParams.birthday"
            style="width: 200px"
            size="small"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item label="患者年龄" prop="age">
          <el-input
            v-model="patientParams.age"
            :readonly="true"
            placeholder="患者年龄"
            clearable
            size="small"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="患者地址" prop="address">
          <el-input
            v-model="patientParams.address"
            placeholder="请输入患者地址"
            clearable
            size="small"
            style="width: 500px"
          />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 患者基本信息表单结束 -->

    <!-- 挂号项目栏开始 -->
    <el-card class="box-card" shadow="always" style="margin-bottom: 10px">
      <el-row>
        <el-col :span="12">
          <el-radio-group v-model="queryDeptParams.regItemId" @change="registeredItemChange">
            <el-radio-button
              v-for="d in regItemOptions"
              :key="d.id"
              :label="d.id"
              :value="d.id"
            >
              {{ d.regItemName }}
            </el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="12">
          <div style="float: right">
            <el-button type="danger" icon="" :disabled="single" size="small" @click="handleRegistration">挂号收费</el-button>
            <span style="margin-left: 20px;color: black;font-weight: bolder">挂号费:￥{{ queryDeptParams.regAmount }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 挂号项目栏结束 -->

    <!-- 科室查询条件开始 -->
    <el-card>
      <el-form ref="queryDeptForm" :model="queryDeptParams" :inline="true" label-width="68px">
        <el-form-item label="所属科室" prop="deptId">
          <el-select
            v-model="queryDeptParams.deptId"
            placeholder="请选择所属科室"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="d in deptOptions"
              :key="d.id"
              :label="d.deptName"
              :value="d.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号类型" prop="schedulingType">
          <el-select
            v-model="queryDeptParams.schedulingType"
            placeholder="请选择挂号类型"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="d in schedulingTypeOptions"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="d.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号时段" prop="subsectionType">
          <el-select
            v-model="queryDeptParams.subsectionType"
            placeholder="请选择挂号时段"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="d in subsectionTypeOptions"
              :key="d.dictValue"
              :label="d.dictLabel"
              :value="d.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="挂号时间" prop="schedulingDay">
          <el-date-picker
            v-model="queryDeptParams.schedulingDay"
            size="small"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleDeptQuery">搜索</el-button>
          <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetDeptQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 部门数据表格开始 -->
      <el-table v-loading="loading" border :data="deptTableList" highlight-current-row @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="科室ID" align="center" prop="id" />
        <el-table-column label="科室名称" align="center" prop="deptName" />
        <el-table-column label="当前号数" align="center" prop="regNumber" />
      </el-table>
      <!-- 部门数据表格结束 -->
    </el-card>
    <!-- 科室查询条件结束 -->
  </div>
</template>

<script>
import { listDeptForScheduling, getPatientByIdCard, addRegistration, collectFee } from '@/api/doctor/registration'
import { selectAllDept } from '@/api/system/dept'
import { selectAllRegisteredItem } from '@/api/system/regItem'

export default {
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 选中部门ID
      ids: [],
      // 非单个禁用
      single: true,
      // 部门下拉列表
      deptOptions: [],
      // 性别
      sexOptions: [],
      // 排班类型
      schedulingTypeOptions: [],
      // 排班时段
      subsectionTypeOptions: [],
      // 挂号项目
      regItemOptions: [],
      patientParams: {
        sex: '2',
        cardNumber: undefined
      },
      queryDeptParams: {
        deptId: undefined,
        regItemId: 1,
        schedulingType: '1',
        subsectionType: undefined,
        schedulingDay: new Date(),
        regAmount: undefined
      },
      // 部门表格数据
      deptTableList: [],
      // 挂号费用
      regAmount: undefined,
      // 表单校验
      rules: {
        name: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        cardNumber: [
          { required: true, message: '身份证号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    patientParams: {
      handler: function() {
        if (this.patientParams.birthday !== undefined) {
          this.patientParams.age = this.getAge(this.patientParams.birthday.substring(0, 10))
        }
      },
      deep: true
    }
  },
  created() {
    // 加载性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载所有部门
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 加载排班类型
    this.getDictDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载排班时段
    this.getDictDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载可用的挂号费用项目
    selectAllRegisteredItem().then(res => {
      this.regItemOptions = res.data
      this.queryDeptParams.regItemId = this.regItemOptions[0].id
      this.queryDeptParams.regAmount = this.regItemOptions[0].regItemFee
    })
    // 设置查询时段
    this.queryDeptParams.subsectionType = this.getCurrentTimeType()
    // 加载有排班的部门数据
    this.getDeptForScheduling()
  },
  methods: {
    // 加载根据身份证号患者信息
    handleLoadPatient() {
      if (this.patientParams.cardNumber === undefined || this.patientParams.cardNumber === '') {
        this.msgError('请输入要查询的身份证号')
        return
      }
      this.loading = true
      getPatientByIdCard(this.patientParams.cardNumber).then(res => {
        console.log(res.data)
        this.patientParams = res.data
        this.patientParams.age = this.getAge(res.data.birthday.substring(0, 10))
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.patientParams = { sex: '2' }
      })
    },
    // 查询有排班的部门信息
    getDeptForScheduling() {
      this.loading = true
      listDeptForScheduling(this.queryDeptParams).then(res => {
        console.log(res.data)
        this.deptTableList = res.data
        this.loading = false
      })
    },
    // 挂号项目切换事件
    registeredItemChange(id) {
      this.regItemOptions.filter(item => {
        if (id === item.id) {
          this.queryDeptParams.regItemId = item.id
          this.queryDeptParams.regAmount = item.regItemFee
        }
      })
      // 动态显示挂号信息
      if (id === 1 || id === 2) {
        this.queryDeptParams.schedulingType = '1'
      } else {
        this.queryDeptParams.schedulingType = '2'
      }
      // 重新查询部门信息
      this.getDeptForScheduling()
    },
    // 条件查询
    handleDeptQuery() {
      this.getDeptForScheduling()
    },
    // 重置
    resetDeptQuery() {
      this.resetForm('queryDeptForm')
      this.getDeptForScheduling()
    },
    // 表格选中行事件
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
    },
    // 挂号收费
    handleRegistration() {
      const tx = this
      tx.$refs['form'].validate(vaid => {
        if (vaid) {
          tx.$confirm('是否确认给【' + this.patientParams.name + '】挂号?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'waring',
            center: true
          }).then(() => {
            const deptId = tx.ids[0]
            const data = {
              'patientDto': tx.patientParams,
              'registrationDto': {
                deptId: deptId,
                regItemId: tx.queryDeptParams.regItemId,
                regAmount: tx.queryDeptParams.regAmount,
                visitDate: this.moment(tx.queryDeptParams.schedulingDay).format('YYYY-MM-DD'),
                schedulingType: tx.queryDeptParams.schedulingType,
                subsectionType: tx.queryDeptParams.subsectionType
              }
            }
            // 挂号
            addRegistration(data).then(res => {
              const id = res.data
              tx.msgSuccess('挂号成功，挂号单号为【' + id + '】')
              // 清空页面数据
              tx.resetDeptQuery()
              tx.patientParams = { sex: '2' }
              tx.$confirm('是否确认给【' + id + '】的挂号单收费?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                closeOnClickModal: false,
                type: 'waring',
                center: true
              }).then(() => {
                // 挂号单收费
                collectFee(id).then(res => {
                  tx.msgSuccess('收费成功')
                  tx.getDeptForScheduling()
                }).catch(() => {
                  tx.msgError('收费失败')
                })
              })
            }).catch(() => {
              tx.msgError('挂号失败')
            })
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.box-card{
    padding: 0;
    margin: 0 0 10px;
}
</style>
