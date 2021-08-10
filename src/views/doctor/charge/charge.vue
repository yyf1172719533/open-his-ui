<template>
  <div v-loading="loading" class="app-container" :element-loading-text="loadingText">
    <!-- 挂号单查询开始 -->
    <el-card style="margin-bottom: 5px">
      <el-form ref="queryForm" label-width="88px">
        <el-form-item label="挂号单ID" prop="regId">
          <el-input
            v-model="regId"
            placeholder="请输入挂号单ID"
            clearable
            size="small"
            style="width: 300px;margin-right: 20px"
          />
          <el-button type="primary" icon="el-icon-search" round size="mini" @click="handleQuery">查询</el-button>
          <el-button type="success" icon="el-icon-refresh" round size="mini" @click="handleReset">重置</el-button>
          <el-button type="warning" icon="el-icon-search" round size="mini" @click="handleQuery">读取IC卡</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 挂号单查询结束 -->

    <div v-if="careHistory.regId !== undefined">
      <!-- 病历信息开始 -->
      <el-card style="margin-bottom: 5px">
        <el-form label-position="right" label-width="120px" inline class="demo-table-expand">
          <el-form-item label="挂号单号：">
            <span v-text="careHistory.regId" />
          </el-form-item>
          <el-form-item label="医生名称：">
            <span v-text="careHistory.doctorName" />
          </el-form-item>
          <el-form-item label="科室名称：">
            <span v-text="careHistory.deptName" />
          </el-form-item>
          <el-form-item label="患者名称：">
            <span v-text="careHistory.patientName" />
          </el-form-item>
          <el-form-item label="就诊时间：">
            <span v-text="careHistory.visitDate" />
          </el-form-item>
          <el-form-item label="主诉：">
            <span v-text="careHistory.caseTitle" />
          </el-form-item>
          <el-form-item label="诊断信息：">
            <span v-text="careHistory.caseResult" />
          </el-form-item>
          <el-form-item label="医生建议：">
            <span v-text="careHistory.doctorTips" />
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 病历信息结束 -->

      <!-- 工具栏按钮开始 -->
      <el-card style="margin-bottom: 5px">
        <el-button type="primary" icon="el-icon-check" @click="handleSelectAll">全选</el-button>
        <el-button type="success" icon="el-icon-close" @click="handleUnSelectAll">取消全选</el-button>
        <el-button type="warning" icon="el-icon-money" @click="handlePayCash">现金</el-button>
        <el-button type="danger" icon="el-icon-bank-card" @click="handlePayZfb">支付宝</el-button>
        <span style="margin-left: 20px">订单总额：<span style="color: red">￥{{ allAmount }}</span></span>
      </el-card>
      <!-- 工具栏按钮结束 -->

      <!-- 未支付的处方详情开始 -->
      <el-card style="margin-bottom: 5px">
        <el-collapse v-if="careOrders.length > 0" v-model="activeNames">
          <el-collapse-item v-for="(item, index) in careOrders" :key="index" :name="index">
            <template slot="title">
              【{{ item.prescType === '0' ? '药用处方' : '检查处方' }}】 【{{ index + 1 }}】 【处方总额】：￥{{ item.amount }}
            </template>
            <el-table
              ref="refTable"
              v-loading="loading"
              border
              :data="item.careOrderItems"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange($event, item.id)"
            >
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="序号" type="index" width="50" align="center" />
              <el-table-column :label="item.prescType === '0' ? '药品名称' : '检查项名称'" align="center" prop="itemName" />
              <el-table-column label="数量" align="center" prop="num" />
              <el-table-column label="单价（元）" align="center" prop="singlePrice" />
              <el-table-column label="金额（元）" align="center" prop="amount" />
              <el-table-column label="备注" align="center" prop="remark" />
              <el-table-column label="状态" align="center" prop="status" :formatter="statusFormatter" />
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </el-card>
      <!-- 未支付的处方详情结束 -->
    </div>
    <div v-else style="text-align: center">
      <el-card>
        请输入正确的挂号单ID查询
      </el-card>
    </div>
  </div>
</template>

<script>
import { getNoChargeCareHistoryByRegId, createOrderChargeWithCash } from '@/api/doctor/charge'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 设置遮罩层文字
      loadingText: '',
      // 挂号单ID
      regId: undefined,
      // 病历对象
      careHistory: {},
      // 当前选中的订单总金额
      allAmount: 0.0,
      // 处方数据
      careOrders: [],
      // 折叠面板名称
      activeNames: [],
      // 处方详情状态数据
      statusOptions: [],
      // 当前选中的所有数据集合
      itemObjs: []
    }
  },
  created() {
    // 加载订单状态数据
    this.getDictDataByType('his_order_details_status').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 挂号单查询
    handleQuery() {
      if (this.regId === undefined || this.regId === '') {
        this.$message({
          message: '请输入挂号单ID',
          type: 'warning'
        })
        return
      }
      this.careHistory = {}
      this.careOrders = []
      this.allAmount = 0.0
      this.loading = true
      this.loadingText = '数据加载中，请稍候...'
      getNoChargeCareHistoryByRegId(this.regId).then(res => {
        this.careHistory = res.data.careHistory
        this.careOrders = res.data.careOrders
        this.loading = false
        this.loadingText = ''
        this.careOrders.filter((e, index) => {
          this.activeNames.push(index)
        })
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
        this.loadingText = ''
      })
    },
    // 重置
    handleReset() {
      this.regId = undefined
      this.allAmount = 0.0
      this.careHistory = {}
      this.careOrders = []
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 监听多个表格的选中事件
    handleSelectionChange(selection, prescriptionId) {
      if (this.itemObjs.length === 0) {
        this.itemObjs = selection
      } else {
        for (let i = 0; i < this.itemObjs.length; i++) {
          if (this.itemObjs[i].prescId === prescriptionId) {
            this.itemObjs.splice(i, 1)
            i--
          }
        }
        selection.filter(item => {
          this.itemObjs.push(item)
        })
      }
      // 计算总金额
      this.calculateAmount()
    },
    // 计算总金额
    calculateAmount() {
      this.allAmount = 0.0
      this.itemObjs.filter(item => {
        this.allAmount += item.amount
      })
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 全选
    handleSelectAll() {
      const tables = this.$refs.refTable
      tables.filter(e => {
        e.toggleAllSelection()
        e.clearSelection()
      })
    },
    // 取消全选
    handleUnSelectAll() {
      const tables = this.$refs.refTable
      tables.filter(e => {
        e.clearSelection()
      })
    },
    // 现金支付
    handlePayCash() {
      if (!this.careHistory.regId) {
        this.$message({
          message: '请输入挂号单ID',
          type: 'warning'
        })
        return
      } else if (this.itemObjs.length === 0) {
        this.$message({
          message: '请选择要支付的处方详情',
          type: 'warning'
        })
        return
      }
      const postObj = {
        orderChargeDto: {
          orderAmount: this.allAmount,
          careHistoryId: this.careHistory.id,
          regId: this.careHistory.regId,
          patientName: this.careHistory.patientName
        },
        orderChargeItemDtoList: []
      }
      this.itemObjs.filter(item => {
        const obj = {
          itemId: item.id,
          prescId: item.prescId,
          itemName: item.itemName,
          itemPrice: item.singlePrice,
          itemNum: item.num,
          itemType: item.itemType,
          itemAmount: item.amount
        }
        postObj.orderChargeItemDtoList.push(obj)
      })
      this.$confirm('是否确定使用现金支付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.loadingText = '现金支付中...'
        createOrderChargeWithCash(postObj).then(res => {
          this.msgSuccess('支付成功')
          this.handleReset()
          this.loading = false
          this.loadingText = ''
        }).catch(() => {
          this.msgError('支付失败')
          this.loading = false
          this.loadingText = ''
        })
      })
    },
    // 支付宝支付
    handlePayZfb() {}
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
