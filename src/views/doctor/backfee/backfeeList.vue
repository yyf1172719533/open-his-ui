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
      <el-form-item label="退款类型" prop="backType">
        <el-select
          v-model="queryParams.backType"
          placeholder="请选择退款类型"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in backTypeOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单状态" prop="backStatus">
        <el-select
          v-model="queryParams.backStatus"
          placeholder="请选择订单状态"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in backStatusOptions"
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
    <el-table v-loading="loading" border :data="orderBackfeeDataTableList">
      <el-table-column label="退款订单号" align="center" prop="id" width="220" />
      <el-table-column label="挂号单号" align="center" prop="regId" width="220" />
      <el-table-column label="患者名称" align="center" prop="patientName" width="160" />
      <el-table-column label="总金额（元）" align="center" prop="backAmount" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.backAmount | rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款类型" align="center" prop="backType" width="160">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.backType === '0'" type="warning" effect="dark">现金</el-tag>
          <el-tag v-else-if="scope.row.backType === '1'" type="danger" effect="dark">支付宝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="订单状态" align="center" prop="backStatus" width="160">
        <template slot-scope="scope">
          <el-tag :type="formatBackStatus(scope.row.backStatus)">
            {{ scope.row.backStatus | backStatusFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
      <el-table-column label="支付时间" align="center" prop="backTime" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" round icon="el-icon-view" size="mini" @click="handleView(scope.row)">查看详情</el-button>
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
      <el-table v-loading="tableLoading" border :data="orderBackfeeItemTableList">
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
        <el-table-column label="状态" align="center" prop="status" :formatter="backDetailsStatusFormatter" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 订单详情对话框结束 -->
  </div>
</template>

<script>
import { queryAllOrderBackfeeForPage, queryOrderBackfeeItemByBackId } from '@/api/doctor/backfee'

export default {
  filters: {
    backStatusFilter(value) {
      if (value === '0') return '未退费'
      if (value === '1') return '已退费'
      if (value === '2') return '退费失败'
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
      orderBackfeeDataTableList: [],
      // 订单详情表格数据
      orderBackfeeItemTableList: [],
      // 对话框标题
      title: '',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        patientName: undefined,
        regId: undefined,
        backType: undefined,
        backStatus: undefined
      },
      // 退款类型数据
      backTypeOptions: [],
      // 退款订单状态
      backStatusOptions: [],
      // 订单详情退款状态
      backDetailsStatusOptions: []
    }
  },
  created() {
    this.getOrderBackfeeList()
    // 加载退款类型
    this.getDictDataByType('his_pay_type_status').then(res => {
      this.backTypeOptions = res.data
    })
    // 加载订单退款状态
    this.getDictDataByType('his_backfee_status').then(res => {
      this.backStatusOptions = res.data
    })
    // 加载订单详情退款状态
    this.getDictDataByType('his_order_details_status').then(res => {
      this.backDetailsStatusOptions = res.data
    })
  },
  methods: {
    getOrderBackfeeList() {
      this.loading = true
      queryAllOrderBackfeeForPage(this.queryParams).then(res => {
        this.orderBackfeeDataTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getOrderBackfeeList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getOrderBackfeeList()
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getOrderBackfeeList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getOrderBackfeeList()
    },
    // 格式化tag标签内容
    formatBackStatus(backStatus) {
      if (backStatus === '0') return 'primary'
      else if (backStatus === '1') return 'success'
      else if (backStatus === '2') return 'danger'
    },
    // 订单详情支付状态转换
    backDetailsStatusFormatter(row) {
      return this.selectDictLabel(this.backDetailsStatusOptions, row.status)
    },
    // 查看订单详情
    handleView(row) {
      this.title = '【' + row.patientName + '】订单退款详情'
      this.tableLoading = true
      this.openItem = true
      queryOrderBackfeeItemByBackId(row.id).then(res => {
        this.orderBackfeeItemTableList = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.openItem = false
      })
    },
    // 关闭订单详情弹出层
    cancel() {
      this.openItem = false
    }
  }
}
</script>

<style scoped>

</style>
