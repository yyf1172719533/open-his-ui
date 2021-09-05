<template>
  <div class="app-container">
    <el-card style="margin-bottom: 10px">
      <div style="text-align: center;color: #dd1100">*注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询</div>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="医生工作量明细列表" name="workload">
          <el-form ref="queryWorkForm" :model="queryWorkParams" :inline="true" label-width="68px">
            <el-form-item label="医生名称" prop="doctorName">
              <el-input
                v-model="queryWorkParams.doctorName"
                placeholder="请输入医生名称"
                clearable
                size="small"
                style="width: 180px;margin-right: 20px"
              />
            </el-form-item>
            <el-form-item label="接诊时间">
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
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleWorkQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetWorkQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="workList">
            <el-table-column label="挂号ID" prop="regId" align="center" />
            <el-table-column label="医生ID" prop="doctorId" align="center" />
            <el-table-column label="医生名称" prop="doctorName" align="center" />
            <el-table-column label="患者名称" prop="patientName" align="center" />
            <el-table-column label="挂号费用（元）" prop="regAmount" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.regAmount | rounding }}</span>
              </template>
            </el-table-column>
            <el-table-column label="接诊时间" prop="visitDate" align="center" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="医生工作量统计列表" name="workStat">
          <el-form ref="queryWorkStatForm" :model="queryWorkStatParams" :inline="true" label-width="68px">
            <el-form-item label="医生名称" prop="doctorName">
              <el-input
                v-model="queryWorkStatParams.doctorName"
                placeholder="请输入医生名称"
                clearable
                size="small"
                style="width: 180px;margin-right: 20px"
              />
            </el-form-item>
            <el-form-item label="接诊时间">
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
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleWorkStatQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetWorkStatQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="workStatList" show-summary>
            <el-table-column label="医生ID" prop="doctorId" align="center" />
            <el-table-column label="医生名称" prop="doctorName" align="center" />
            <el-table-column label="接诊次数" prop="totalNum" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { queryWorkload, queryWorkloadStat } from '@/api/statistics/work'

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
      activeName: 'workload',
      // 医生工作量明细查询参数
      queryWorkParams: {
        doctorName: undefined
      },
      // 医生工作量明细列表数据
      workList: [],
      // 医生工作量统计列表数据
      workStatList: [],
      // 医生工作量统计查询参数
      queryWorkStatParams: {
        doctorName: undefined
      },
      // 时间范围
      dateRange: []
    }
  },
  created() {
    this.getWorkloadData()
  },
  methods: {
    // 查询医生工作量明细数据
    getWorkloadData() {
      this.loading = true
      queryWorkload(this.addDateRange(this.queryWorkParams, this.dateRange)).then(res => {
        this.workList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    // 查询医生工作量统计数据
    getWorkloadStatData() {
      this.loading = true
      queryWorkloadStat(this.addDateRange(this.queryWorkStatParams, this.dateRange)).then(res => {
        this.workStatList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    handleClick() {
      if (this.activeName === 'workload') {
        this.resetForm('queryWorkStatForm')
        this.dateRange = []
        this.getWorkloadData()
      } else if (this.activeName === 'workStat') {
        this.resetForm('queryWorkForm')
        this.dateRange = []
        this.getWorkloadStatData()
      }
    },
    handleWorkQuery() {
      this.getWorkloadData()
    },
    resetWorkQuery() {
      this.resetForm('queryWorkForm')
      this.dateRange = []
      this.getWorkloadData()
    },
    handleWorkStatQuery() {
      this.getWorkloadStatData()
    },
    resetWorkStatQuery() {
      this.resetForm('queryWorkStatForm')
      this.dateRange = []
      this.getWorkloadStatData()
    }
  }
}
</script>

<style scoped>

</style>
