<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-row :gutter="12" style="margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <el-form :inline="true" label-width="68px">
            <el-form-item style="float: right">
              <el-button type="primary" round icon="el-icon-s-fold" size="small" @click="upWeek">上一周</el-button>
              <el-button type="success" round icon="el-icon-s-operation" size="small" @click="currentWeek">当前周</el-button>
              <el-button type="warning" round icon="el-icon-s-unfold" size="small" @click="nextWeek">下一周</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 查询条件结束 -->

    <!-- 时间范围开始 -->
    <el-row :gutter="12" style="margin-bottom: 5px">
      <el-col :span="24">
        <el-card shadow="always">
          <div style="text-align: center">
            <span>{{ schedulingData.startTimeThisWeek }}(周一)</span> - <span>{{ schedulingData.endTimeThisWeek }}(周日)</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 时间范围结束 -->

    <!-- 排班表格开始 -->
    <el-table v-loading="loading" :data="tableData" border :span-method="spanMethod">
      <el-table-column prop="userId" label="医生" align="center" :formatter="userFormatter" />
      <el-table-column prop="deptId" label="科室" align="center" :formatter="deptFormatter" />
      <el-table-column prop="subsectionType" label="时间/日期" align="center" :formatter="subsectionTypeFormatter" />
      <el-table-column prop="schedulingType[0]" :label="labelNames[0]" align="center" :formatter="schedulingTypeDAY1Formatter" />
      <el-table-column prop="schedulingType[1]" :label="labelNames[1]" align="center" :formatter="schedulingTypeDAY2Formatter" />
      <el-table-column prop="schedulingType[2]" :label="labelNames[2]" align="center" :formatter="schedulingTypeDAY3Formatter" />
      <el-table-column prop="schedulingType[3]" :label="labelNames[3]" align="center" :formatter="schedulingTypeDAY4Formatter" />
      <el-table-column prop="schedulingType[4]" :label="labelNames[4]" align="center" :formatter="schedulingTypeDAY5Formatter" />
      <el-table-column prop="schedulingType[5]" :label="labelNames[5]" align="center" :formatter="schedulingTypeDAY6Formatter" />
      <el-table-column prop="schedulingType[6]" :label="labelNames[6]" align="center" :formatter="schedulingTypeDAY7Formatter" />
    </el-table>
    <!-- 排班表格结束 -->
  </div>
</template>

<script>
import { queryMyScheduling, queryUsersNeedScheduling } from '@/api/doctor/scheduling'
import { selectAllDept } from '@/api/system/dept'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 排班类型数据
      schedulingTypeOptions: [],
      // 排班时间段数据
      subsectionTypeOptions: [],
      schedulingData: {
        startTimeThisWeek: undefined,
        endTimeThisWeek: undefined
      },
      // 排班表数据
      tableData: [],
      labelNames: ['', '', '', '', '', '', ''],
      // 查询参数
      queryParams: {
        queryDate: undefined
      },
      // 科室数据
      deptOptions: [],
      // 医生数据
      userOptions: []
    }
  },
  computed: {
    groupNum() {
      return new Set(this.tableData.map(o => o.userId))
    }
  },
  created() {
    // 加载科室
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 加载需要排班的医生数据
    queryUsersNeedScheduling().then(res => {
      this.userOptions = res.data
    })
    // 加载排班时段
    this.getDictDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载排班类型
    this.getDictDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    this.getMySchedulingList()
  },
  methods: {
    // 查询排班数据
    getMySchedulingList() {
      this.loading = true
      queryMyScheduling(this.queryParams).then(res => {
        this.tableData = res.data.tableData
        this.labelNames = res.data.labelNames
        this.schedulingData = res.data.schedulingData
        this.loading = false
      })
    },
    // 上一周
    upWeek() {
      this.queryParams.queryDate = this.schedulingData.startTimeThisWeek
      this.getMySchedulingList()
    },
    // 当前周
    currentWeek() {
      this.queryParams.queryDate = undefined
      this.getMySchedulingList()
    },
    // 下一周
    nextWeek() {
      this.queryParams.queryDate = this.schedulingData.endTimeThisWeek
      this.getMySchedulingList()
    },
    // 医生转换数据
    userFormatter(row) {
      let userName = ''
      this.userOptions.filter(item => {
        if (row.userId === item.id) {
          userName = item.userName
        }
      })
      return userName
    },
    // 科室转换数据
    deptFormatter(row) {
      let deptName = ''
      this.deptOptions.filter(item => {
        if (row.deptId === item.id) {
          deptName = item.deptName
        }
      })
      return deptName
    },
    // 排班时间转换数据
    subsectionTypeFormatter(row) {
      return this.selectDictLabel(this.subsectionTypeOptions, row.subsectionType)
    },
    // 排班类型转换数据
    schedulingTypeDAY1Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[0])
    },
    schedulingTypeDAY2Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[1])
    },
    schedulingTypeDAY3Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[2])
    },
    schedulingTypeDAY4Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[3])
    },
    schedulingTypeDAY5Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[4])
    },
    schedulingTypeDAY6Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[5])
    },
    schedulingTypeDAY7Formatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType[6])
    },
    // 合并单元格
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 2 || columnIndex > 9) {
        const len = this.userGroup(row.userId)
        const lenName = this.userIdLen(row.userId)
        if (rowIndex === lenName) {
          return {
            rowspan: len,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }
    },
    userGroup(id) {
      return this.tableData.filter(o => o.userId === id).length
    },
    userIdLen(id) {
      const tmp = Array.from(this.groupNum)
      const index = tmp.indexOf(id)
      let len = 0
      for (let i = 0; i < index; i++) {
        len += this.userGroup(tmp[i])
      }
      return len
    }
  }
}
</script>

<style scoped>

</style>
