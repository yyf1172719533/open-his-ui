<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="88px">
      <el-form-item label="供应商" prop="providerId">
        <el-select
          v-model="queryParams.providerId"
          placeholder="请选择供应商"
          clearable
          size="small"
          style="width:200px"
        >
          <el-option
            v-for="dict in providerOptions"
            :key="dict.id"
            :label="dict.providerName"
            :value="dict.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="申请人" prop="applyUserName">
        <el-input
          v-model="queryParams.applyUserName"
          placeholder="请输入申请人"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="单据状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择单据状态"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增采购</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handDoAudit">提交审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDoInvalid">作废
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleDoInventory">提交入库
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="purchaseTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="单据ID" align="center" prop="id" />
      <el-table-column label="供应商" align="center" prop="providerId" :formatter="providerFormatter" />
      <el-table-column label="采购批发总金额" align="center" prop="purchaseTradeTotalAmount" />
      <el-table-column label="申请人" align="center" prop="applyUserName" />
      <el-table-column label="入库操作人" align="center" prop="storageOptUser" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="入库时间" align="center" prop="storageOptTime" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
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
  </div>
</template>

<script>
import { listPurchaseForPage, doAudit, doInvalid } from '@/api/erp/purchase'
import { selectAllProvider } from '@/api/erp/provider'

export default {
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 表格公告数据
      purchaseTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 供应商数据
      providerOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        providerId: undefined,
        applyUserName: undefined,
        status: undefined
      }
    }
  },
  created() {
    this.getPurchaseList()
    // 加载状态
    this.getDictDataByType('his_order_status').then(res => {
      this.statusOptions = res.data
    })
    // 加载供应商
    selectAllProvider().then(res => {
      this.providerOptions = res.data
    })
  },
  methods: {
    getPurchaseList() {
      // 打开遮罩层
      this.loading = true
      listPurchaseForPage(this.queryParams).then(res => {
        this.purchaseTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getPurchaseList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getPurchaseList()
    },
    // 数据表格多选时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getPurchaseList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getPurchaseList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 供应商转换
    providerFormatter(row) {
      let providerName = ''
      this.providerOptions.filter(item => {
        if (parseInt(item.id) === parseInt(row.providerId)) {
          providerName = item.providerName
        }
      })
      return providerName
    },
    // 提交审核
    handDoAudit() {
      const purchaseId = this.ids[0]
      this.$confirm('是否提交审核单据ID为：' + purchaseId + '的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        doAudit(purchaseId).then(res => {
          this.loading = false
          this.msgSuccess('提交审核成功')
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          this.msgError('提交审核失败')
          this.getPurchaseList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 单据作废
    handleDoInvalid() {
      const purchaseId = this.ids[0]
      this.$confirm('是否确定作废单据ID为：' + purchaseId + '的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        doInvalid(purchaseId).then(res => {
          this.loading = false
          this.msgSuccess('作废成功')
          this.getPurchaseList()
        }).catch(() => {
          this.loading = false
          this.msgError('作废失败')
          this.getPurchaseList()
        })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
