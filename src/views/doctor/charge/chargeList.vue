<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="患者名称" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者名称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="挂号单号" prop="regId">
        <el-input
          v-model="queryParams.regId"
          placeholder="请输入挂号单号"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="支付类型" prop="payType">
        <el-select
          v-model="queryParams.payType"
          placeholder="请选择支付类型"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in payTypeOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderStatus">
        <el-select
          v-model="queryParams.orderStatus"
          placeholder="请选择订单状态"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in orderStatusOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="orderChargeDataTableList">
      <el-table-column label="订单号" align="center" prop="id" width="220" />
      <el-table-column label="挂号单号" align="center" prop="regId" width="220" />
      <el-table-column label="患者名称" align="center" prop="patientName" width="160" />
      <el-table-column label="总金额（元）" align="center" prop="orderAmount" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.orderAmount | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付类型" align="center" prop="payType" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType === '0'" type="warning" effect="dark">现金</el-tag>
          <el-tag v-else-if="scope.row.payType === '1'" type="danger" effect="dark">支付宝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="orderStatus" width="160">
        <template slot-scope="scope">
          <el-tag :type="formatOrderStatus(scope.row.orderStatus)">
            {{ scope.row.orderStatus | orderStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="支付时间" align="center" prop="payTime" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" round icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看详情</el-button>
          <el-button v-show="scope.row.orderStatus !== '1'" type="warning" round icon="el-icon-money" size="mini" @click="handlePayWithCash(scope.row)">现金支付</el-button>
          <el-button v-show="scope.row.orderStatus !== '1'" type="danger" round icon="el-icon-bank-card" size="mini" @click="handlePayWithZfb(scope.row)">支付宝支付</el-button>
        </template>
      </el-table-column>
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

    <!-- 订单详情对话框开始 -->
    <el-dialog
      v-loading="loading"
      :title="title"
      :visible.sync="openItem"
      width="1200px"
      center
      append-to-body
    >
      <el-table v-loading="tableLoading" border :data="orderChargeItemTableList">
        <el-table-column label="详情ID" align="center" prop="id" />
        <el-table-column label="处方ID" align="center" width="200" prop="prescId" />
        <el-table-column label="名称" align="center" prop="itemName" />
        <el-table-column label="单价（元）" align="center" prop="itemPrice">
          <template slot-scope="scope">
            <span>{{ scope.row.itemPrice | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量" align="center" prop="itemNum" />
        <el-table-column label="小计（元）" align="center" prop="itemAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.itemAmount | rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center" prop="itemType">
          <template slot-scope="scope">
            {{ scope.row.itemType === '0' ? '药品' : '检查' }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status" :formatter="orderDetailsStatusFormatter" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 订单详情对话框结束 -->

    <!-- 支付宝二维码弹框开始 -->
    <el-dialog
      width="400px"
      :visible.sync="openPay"
      center
      :close-on-click-modal="false"
      :before-close="handleClose"
      append-to-body
    >
      <div style="text-align: center">
        <vue-qr :text="payObj.qrCode" :logo-src="downloadData.icon + '?cache'" :logo-scale="0.2" :size="200" />
        <div>请使用支付宝扫码支付</div>
        <div style="color: #dd1100;font-size: large;font-weight: bold;margin-top: 10px">￥ {{ payObj.allAmount }}</div>
      </div>
    </el-dialog>
    <!-- 支付宝二维码弹框结束 -->
  </div>
</template>

<script>
import {
  queryAllOrderChargeForPage,
  queryOrderChargeItemByOrderId,
  payWithCash,
  toPayOrderWithZfb,
  queryOrderChargeOrderId
} from '@/api/doctor/charge'
import vueQr from 'vue-qr'

export default {
  components: {
    vueQr
  },
  filters: {
    orderStatusFilter(value) {
      if (value === '0') return '未支付'
      if (value === '1') return '支付成功'
      if (value === '2') return '支付超时'
      if (value === '3') return '支付失败'
    },
    // 保留两位小数
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 表格遮罩层
      tableLoading: false,
      // 是否打开订单详情对话框
      openItem: false,
      // 分页数据总条数
      total: 0,
      // 订单表格数据
      orderChargeDataTableList: [],
      // 订单详情表格数据
      orderChargeItemTableList: [],
      // 对话框标题
      title: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        regId: undefined,
        payType: undefined,
        orderStatus: undefined
      },
      // 支付类型数据
      payTypeOptions: [],
      // 订单状态
      orderStatusOptions: [],
      // 订单详情支付状态
      orderDetailsStatusOptions: [],
      // 支付对象
      payObj: {},
      // 二维码弹出层
      openPay: false,
      // 定时轮询对象
      intervalObj: undefined,
      // 二维码中间图片
      downloadData: {
        url: 'http://pic.yupoo.com/yyf1172719533/72fe337b/867a52d4.jpeg',
        icon: 'http://pic.yupoo.com/yyf1172719533/72fe337b/867a52d4.jpeg'
      }
    }
  },
  created() {
    this.getOrderChargeList()
    // 加载支付类型
    this.getDictDataByType('his_pay_type_status').then(res => {
      this.payTypeOptions = res.data
    })
    // 加载订单状态
    this.getDictDataByType('his_order_charge_status').then(res => {
      this.orderStatusOptions = res.data
    })
    // 加载订单详情状态
    this.getDictDataByType('his_order_details_status').then(res => {
      this.orderDetailsStatusOptions = res.data
    })
  },
  methods: {
    getOrderChargeList() {
      this.loading = true
      queryAllOrderChargeForPage(this.queryParams).then(res => {
        this.orderChargeDataTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOrderChargeList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getOrderChargeList()
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getOrderChargeList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getOrderChargeList()
    },
    // 格式化tag标签内容
    formatOrderStatus(orderStatus) {
      if (orderStatus === '0') return 'primary'
      else if (orderStatus === '1') return 'success'
      else if (orderStatus === '2') return 'warning'
      else if (orderStatus === '3') return 'danger'
    },
    // 订单详情支付状态转换
    orderDetailsStatusFormatter(row) {
      return this.selectDictLabel(this.orderDetailsStatusOptions, row.status)
    },
    // 查看订单详情
    handleView(row) {
      this.title = '【' + row.patientName + '】支付订单详情'
      this.tableLoading = true
      this.openItem = true
      queryOrderChargeItemByOrderId(row.id).then(res => {
        this.orderChargeItemTableList = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.openItem = false
      })
    },
    // 关闭订单详情弹出层
    cancel() {
      this.openItem = false
    },
    // 现金支付
    handlePayWithCash(row) {
      this.$confirm('是否确定使用现金支付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        payWithCash(row.id).then(res => {
          this.msgSuccess('支付成功')
          this.loading = false
          this.getOrderChargeList()
        }).catch(() => {
          this.msgError('支付失败')
          this.loading = false
          this.getOrderChargeList()
        })
      })
    },
    // 支付宝支付
    handlePayWithZfb(row) {
      this.$confirm('是否确定使用支付宝支付？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toPayOrderWithZfb(row.id).then(res => {
          this.payObj = res.data
          const tx = this
          // 打开二维码弹出层
          tx.openPay = true
          // 定时轮询  查询是否支付成功
          tx.intervalObj = setInterval(function() {
            // 根据订单ID查询订单信息
            queryOrderChargeOrderId(tx.payObj.orderId).then(r => {
              if (r.data.orderStatus === '1') {
                // 扫码支付成功
                // 清除定时器
                clearInterval(tx.intervalObj)
                tx.msgSuccess('扫码支付成功')
                tx.openPay = false
                tx.getOrderChargeList()
              }
            }).catch(() => {
              // 清除定时器
              clearInterval(tx.intervalObj)
            })
          }, 2000)
        }).catch(() => {
          this.msgError('支付失败')
        })
      })
    },
    // 二维码弹出层关闭
    handleClose() {
      this.openPay = false
      clearInterval(this.intervalObj)
    }
  }
}
</script>

<style scoped>

</style>
