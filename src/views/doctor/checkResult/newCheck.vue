<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-card>
      <el-form ref="queryForm" :model="queryParams" label-width="68px">
        <el-form-item label="检查项目" prop="checkItemIds">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckedItemsChange">
            <el-checkbox
              v-for="d in checkItemOptions"
              :key="d.id"
              :label="d.id"
              :value="d.id"
            >{{ d.itemName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="挂号单ID" prop="regId">
          <el-input
            v-model="queryParams.regId"
            placeholder="请输入挂号单ID"
            clearable
            size="small"
            style="width: 380px;margin-right: 20px"
          />
          <el-button type="primary" icon="el-icon-search" round size="mini" @click="handleQuery">查询</el-button>
          <el-button type="success" icon="el-icon-refresh" round size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询条件结束 -->

    <!-- 数据表格开始 -->
    <el-card style="margin-top: 5px">
      <el-table
        ref="refTable"
        :data="prescriptionItemListTable"
        border
        highlight-current-row
        @current-change="handleCurrentChange"
      >
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="详情ID" prop="id" align="center" />
        <el-table-column label="项目名称" prop="itemName" align="center" />
        <el-table-column label="数量" prop="num" align="center" />
        <el-table-column label="单价（元）" prop="singlePrice" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.singlePrice | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额（元）" prop="amount" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.amount | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" align="center" />
        <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      </el-table>
    </el-card>
    <!-- 数据表格结束 -->

    <!-- 检查开始 -->
    <el-card style="margin-top: 5px">
      <div v-if="dataShow" v-loading="dataLoading">
        <el-form label-position="right" label-width="120px" inline class="demo-table-expand">
          <el-form-item label="挂号单号：">
            <span v-text="itemObjs.careHistory.regId" />
          </el-form-item>
          <el-form-item label="患者名称：">
            <span v-text="itemObjs.careHistory.patientName" />
          </el-form-item>
          <el-form-item label="检查项目：">
            <span v-text="itemObjs.prescriptionItem.itemName" />
          </el-form-item>
          <el-form-item label="备注：">
            <span v-text="itemObjs.prescriptionItem.remark" />
          </el-form-item>
        </el-form>
        <div>
          <el-button type="primary" style="width: 100%" icon="el-icon-video-play" @click="handleStartCheck">开始检查</el-button>
        </div>
      </div>
      <div v-else style="text-align: center">
        暂无数据
      </div>
    </el-card>
    <!-- 检查结束 -->
  </div>
</template>

<script>
import { selectAllCheckItem } from '@/api/system/checkItem'
import { queryNeedCheckItem, queryCheckItemByItemId, startCheck } from '@/api/doctor/checkResult'

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
      // 开始检查遮罩层
      dataLoading: false,
      // 是否全选
      checkAll: true,
      // 检查项目数据
      checkItemOptions: [],
      // 是否半选
      isIndeterminate: false,
      queryParams: {
        regId: undefined,
        checkItemIds: []
      },
      // 处方详情数据表格
      prescriptionItemListTable: [],
      // 处方详情状态数据
      statusOptions: [],
      // 检查项目相关数据
      itemObjs: {
        careHistory: {},
        prescriptionItem: {}
      },
      // 当前选中行
      currentRow: undefined,
      // 数据是否展示
      dataShow: false
    }
  },
  created() {
    selectAllCheckItem().then(res => {
      this.checkItemOptions = res.data
      this.queryParams.checkItemIds = res.data.map(item => item.id)
      this.findPrescriptionItemList()
    })
    // 加载处方详情状态数据
    this.getDictDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询已支付的检查项目
    findPrescriptionItemList() {
      this.loading = true
      queryNeedCheckItem(this.queryParams).then(res => {
        this.prescriptionItemListTable = res.data
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    // 全选
    handleCheckAllChange(val) {
      this.queryParams.checkItemIds = val ? this.checkItemOptions.map(item => item.id) : []
      this.isIndeterminate = false
    },
    // 选择某一个检查项目
    handleCheckedItemsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.checkItemOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkItemOptions.length
    },
    // 查询
    handleQuery() {
      this.findPrescriptionItemList()
      this.dataShow = false
    },
    // 重置
    handleReset() {
      this.resetForm('queryForm')
      this.queryParams.checkItemIds = this.checkItemOptions.map(item => item.id)
      this.findPrescriptionItemList()
      this.dataShow = false
    },
    // 状态翻译
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 选中表格某一行
    handleCurrentChange(val) {
      this.currentRow = val
      if (val != null) {
        this.dataLoading = true
        queryCheckItemByItemId(this.currentRow.id).then(res => {
          this.itemObjs = res.data
          this.dataShow = true
          this.dataLoading = false
        }).catch(() => {
          this.msgError('加载失败')
          this.dataLoading = false
        })
      }
    },
    // 开始检查
    handleStartCheck() {
      this.$confirm('是否确定开始检查？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        startCheck(this.itemObjs.prescriptionItem.id).then(res => {
          this.msgSuccess('已开始检查')
          this.findPrescriptionItemList()
          this.dataShow = false
          this.loading = false
        }).catch(() => {
          this.msgError('启动检查失败')
          this.loading = false
        })
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
</style>
