<template>
  <div class="app-container">
    <el-card style="margin-bottom: 10px">
      <div style="text-align: center;color: #dd1100">*注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询</div>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
        <el-tab-pane label="药品销售明细列表" name="drug">
          <el-form ref="queryDrugForm" :model="queryDrugParams" :inline="true" label-width="68px">
            <el-form-item label="药品名称" prop="medicineName">
              <el-input
                v-model="queryDrugParams.medicineName"
                placeholder="请输入药品名称"
                clearable
                size="small"
                style="width: 180px;margin-right: 20px"
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
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDrugQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetDrugQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="drugList">
            <el-table-column label="药品ID" prop="medicineId" align="center" />
            <el-table-column label="药品名称" prop="medicineName" align="center" />
            <el-table-column label="药品数量" prop="num" align="center" />
            <el-table-column label="药品单价（元）" prop="singlePrice" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.singlePrice | rounding }}</span>
              </template>
            </el-table-column>
            <el-table-column label="药品总价（元）" prop="amount" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.amount | rounding }}</span>
              </template>
            </el-table-column>
            <el-table-column label="交易时间" prop="createTime" align="center" />
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="药品销售统计列表" name="drugStat">
          <el-form ref="queryDrugStatForm" :model="queryDrugStatParams" :inline="true" label-width="68px">
            <el-form-item label="药品名称" prop="medicineName">
              <el-input
                v-model="queryDrugParams.medicineName"
                placeholder="请输入药品名称"
                clearable
                size="small"
                style="width: 180px;margin-right: 20px"
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
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleDrugStatQuery">搜索</el-button>
              <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetDrugStatQuery">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table v-loading="loading" border :data="drugStatList" show-summary>
            <el-table-column label="药品ID" prop="medicineId" align="center" />
            <el-table-column label="药品名称" prop="medicineName" align="center" />
            <el-table-column label="药品数量" prop="totalNum" align="center" />
            <el-table-column label="药品总价（元）" prop="totalAmount" align="center">
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
import { queryDrug, queryDrugStat } from '@/api/statistics/drug'

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
      activeName: 'drug',
      // 药品销售明细查询参数
      queryDrugParams: {
        medicineName: undefined
      },
      // 药品销售明细列表数据
      drugList: [],
      // 药品销售统计列表数据
      drugStatList: [],
      // 药品销售统计查询参数
      queryDrugStatParams: {
        medicineName: undefined
      },
      // 时间范围
      dateRange: []
    }
  },
  created() {
    this.getDrugData()
  },
  methods: {
    // 查询药品销售明细数据
    getDrugData() {
      this.loading = true
      queryDrug(this.addDateRange(this.queryDrugParams, this.dateRange)).then(res => {
        this.drugList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    // 查询药品销售统计数据
    getDrugStatData() {
      this.loading = true
      queryDrugStat(this.addDateRange(this.queryDrugStatParams, this.dateRange)).then(res => {
        this.drugStatList = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    handleClick() {
      if (this.activeName === 'drug') {
        this.resetForm('queryDrugStatForm')
        this.dateRange = []
        this.getDrugData()
      } else if (this.activeName === 'drugStat') {
        this.resetForm('queryDrugForm')
        this.dateRange = []
        this.getDrugStatData()
      }
    },
    handleDrugQuery() {
      this.getDrugData()
    },
    resetDrugQuery() {
      this.resetForm('queryDrugForm')
      this.dateRange = []
      this.getDrugData()
    },
    handleDrugStatQuery() {
      this.getDrugStatData()
    },
    resetDrugStatQuery() {
      this.resetForm('queryDrugStatForm')
      this.dateRange = []
      this.getDrugStatData()
    }
  }
}
</script>

<style scoped>

</style>
