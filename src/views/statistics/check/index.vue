<template>
  <div class="app-container">
    <el-card style="margin-bottom: 10px">
      <div style="text-align: center;color: #dd1100">*注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询</div>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="检查项目列表" name="check">
          <el-form ref="queryCheckForm" :model="queryCheckParams" :inline="true" label-width="68px">
            <el-form-item label="检查项目" prop="itemId">
              <el-select
                v-model="queryCheckParams.itemId"
                placeholder="请选择检查项目"
                clearable
                size="small"
                style="width: 180px"
              >
                <el-option
                  v-for="d in checkItemOptions"
                  :key="d.id"
                  :label="d.itemName"
                  :value="d.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="患者名称" prop="patientName">
              <el-input
                v-model="queryCheckParams.patientName"
                placeholder="请输入患者名称"
                clearable
                size="small"
                style="width: 180px;"
              />
            </el-form-item>
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width:240px;margin-right: 10px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleCheckQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetCheckQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="checkList">
            <el-table-column label="项目ID" prop="itemId" align="center" />
            <el-table-column label="项目名称" prop="itemName" align="center" />
            <el-table-column label="项目单价（元）" prop="itemPrice" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.itemPrice | rounding }}</span>
              </template>
            </el-table-column>
            <el-table-column label="患者名称" prop="patientName" align="center" />
            <el-table-column label="检查项目状态" prop="resultStatus" align="center" :formatter="resultStatusFormatter" />
            <el-table-column label="检查时间" prop="createTime" align="center" />
            <el-table-column label="操作人" prop="createBy" align="center" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="检查项目统计列表" name="checkStat">
          <el-form ref="queryCheckStatForm" :model="queryCheckStatParams" :inline="true" label-width="68px">
            <el-form-item label="检查项目" prop="itemId">
              <el-select
                v-model="queryCheckStatParams.itemId"
                placeholder="请选择检查项目"
                clearable
                size="small"
                style="width: 180px"
              >
                <el-option
                  v-for="d in checkItemOptions"
                  :key="d.id"
                  :label="d.itemName"
                  :value="d.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="交易时间">
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width:240px;margin-right: 10px"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="-"
                start-placeholde="开始日期"
                end-placeholde="结束日期"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDrugStatQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetDrugStatQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="checkStatList" show-summary>
            <el-table-column label="项目ID" prop="itemId" align="center" />
            <el-table-column label="项目名称" prop="itemName" align="center" />
            <el-table-column label="检查次数" prop="totalNum" align="center" />
            <el-table-column label="总金额（元）" prop="totalAmount" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.totalAmount | rounding }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { queryCheck, queryCheckStat } from '@/api/statistics/check'
import { selectAllCheckItem } from '@/api/system/checkItem'

export default {
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // tabs名称
      activeName: 'check',
      // 检查项目查询参数
      queryCheckParams: {
        itemId: undefined,
        patientName: undefined
      },
      // 检查项目名称数据
      checkItemOptions: [],
      // 检查列表数据
      checkList: [],
      // 检查统计列表数据
      checkStatList: [],
      // 检查统计查询参数
      queryCheckStatParams: {
        itemId: undefined
      },
      // 时间范围
      dateRange: [],
      // 检查结果状态数据
      resultStatusOptions: []
    }
  },
  created() {
    selectAllCheckItem().then(res => {
      this.checkItemOptions = res.data
    })
    this.getDictDataByType('his_check_result_status').then(res => {
      this.resultStatusOptions = res.data
    })
    this.getCheckData()
  },
  methods: {
    // 查询检查项目列表数据
    getCheckData() {
      this.loading = true
      queryCheck(this.addDateRange(this.queryCheckParams, this.dateRange)).then(res => {
        this.checkList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    // 查询检查项目统计数据
    getCheckStatData() {
      this.loading = true
      queryCheckStat(this.addDateRange(this.queryCheckStatParams, this.dateRange)).then(res => {
        this.checkStatList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    handleClick() {
      if (this.activeName === 'check') {
        this.resetForm('queryCheckForm')
        this.dateRange = []
        this.getCheckData()
      } else if (this.activeName === 'checkStat') {
        this.resetForm('queryCheckStatForm')
        this.dateRange = []
        this.getCheckStatData()
      }
    },
    handleCheckQuery() {
      this.getCheckData()
    },
    resetCheckQuery() {
      this.resetForm('queryCheckForm')
      this.dateRange = []
      this.getCheckStatData()
    },
    handleDrugStatQuery() {
      this.getCheckStatData()
    },
    resetDrugStatQuery() {
      this.resetForm('queryCheckStatForm')
      this.dateRange = []
      this.getCheckStatData()
    },
    resultStatusFormatter(row) {
      return this.selectDictLabel(this.resultStatusOptions, row.resultStatus)
    }
  }
}
</script>

<style scoped>

</style>
