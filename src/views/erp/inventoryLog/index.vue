<template>
  <div class="app-container">
    <el-tabs v-model="activeName" :stretch="true" @tab-click="handleClick">
      <el-tab-pane label="药品总库存" name="medicinesTab">
        <!-- 查询条件开始 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
          <el-form-item label="药品名称" prop="medicineName">
            <el-input
              v-model="queryParams.medicineName"
              placeholder="请输入药品名称"
              clearable
              size="small"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicineType">
            <el-select
              v-model="queryParams.medicineType"
              placeholder="请选择药品类型"
              clearable
              size="small"
              style="width:240px"
            >
              <el-option
                v-for="dict in medicineTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="关键字" prop="keywords">
            <el-input
              v-model="queryParams.keywords"
              placeholder="请输入关键字"
              clearable
              size="small"
              style="width:200px"
            />
          </el-form-item>
          <el-form-item label="处方类型" prop="prescriptionType">
            <el-select
              v-model="queryParams.prescriptionType"
              placeholder="请选择处方类型"
              clearable
              size="small"
              style="width:200px"
            >
              <el-option
                v-for="dict in prescriptionTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家" prop="producterId">
            <el-select
              v-model="queryParams.producterId"
              placeholder="请选择生产厂家"
              clearable
              size="small"
              style="width:200px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.id"
                :label="dict.producterName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
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

        <!-- 数据表格开始 -->
        <el-table v-loading="loading" border :data="medicinesTableList">
          <el-table-column label="ID" align="center" prop="id" />
          <el-table-column label="药品名称" align="center" prop="medicineName" />
          <el-table-column label="药品编号" align="center" prop="medicineNumber" />
          <el-table-column label="生产厂家" align="center" prop="producterId" :formatter="producterFormatter" />
          <el-table-column label="药品类型" align="center" prop="medicineType" :formatter="medicineFormatter" />
          <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
          <el-table-column label="库存量" align="center" prop="medicineStockNum" />
          <el-table-column label="预警值" align="center" prop="medicineStockDangerNum">
            <el-tag
              slot-scope="scope"
              effect="dark"
              type="danger"
            >
              {{ scope.row.medicineStockDangerNum }}
            </el-tag>
          </el-table-column>
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
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
      </el-tab-pane>
      <el-tab-pane label="药品入库日志" name="inventoryLogTab">
        <!-- 查询条件开始 -->
        <el-form ref="queryLogForm" :model="queryLogParams" :inline="true" label-width="88px">
          <el-form-item label="采购单据号" prop="purchaseId">
            <el-input
              v-model="queryLogParams.purchaseId"
              placeholder="采购单据号"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="药品名称" prop="medicinesName">
            <el-input
              v-model="queryLogParams.medicinesName"
              placeholder="请输入药品名称"
              clearable
              size="small"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item label="药品类型" prop="medicinesType">
            <el-select
              v-model="queryLogParams.medicinesType"
              placeholder="药品类型"
              clearable
              size="small"
              style="width:180px"
            >
              <el-option
                v-for="dict in medicineTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生产厂家" prop="producterId">
            <el-select
              v-model="queryLogParams.producterId"
              placeholder="生产厂家"
              clearable
              size="small"
              style="width:180px"
            >
              <el-option
                v-for="dict in producterOptions"
                :key="dict.id"
                :label="dict.producterName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处方类型" prop="prescriptionType">
            <el-select
              v-model="queryLogParams.prescriptionType"
              placeholder="处方类型"
              clearable
              size="small"
              style="width:180px"
            >
              <el-option
                v-for="dict in prescriptionTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="入库时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width:240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholde="开始日期"
              end-placeholde="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 查询条件结束 -->
        <!-- 数据表格开始 -->
        <el-table v-loading="loading" border :data="inventoryLogTableList">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="入库号">
                  <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="单据号">
                  <span>{{ props.row.purchaseId }}</span>
                </el-form-item>
                <el-form-item label="规格">
                  <span>{{ props.row.conversion }}{{ props.row.unit }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="药品ID" align="center" prop="medicinesId" />
          <el-table-column label="药品名称" align="center" prop="medicinesName" />
          <el-table-column label="入库数量" align="center" prop="inventoryNum" />
          <el-table-column label="批发价" align="center" prop="tradePrice">
            <template slot-scope="scope">
              <span>{{ scope.row.tradePrice|rounding }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批发总金额" align="center" prop="tradeTotalAmount">
            <template slot-scope="scope">
              <span>{{ scope.row.tradeTotalAmount|rounding }}</span>
            </template>
          </el-table-column>
          <el-table-column label="批次号" align="center" prop="batchNumber" />
          <el-table-column label="生产厂家" width="280px" align="center" prop="producterId" :formatter="producterFormatter" />
          <el-table-column label="药品类型" align="center" prop="medicinesType" :formatter="medicinesFormatter" />
          <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
          <el-table-column label="入库时间" width="180px" align="center" prop="createTime" />
        </el-table>
        <!-- 数据表格结束 -->
        <!-- 分页控件开始 -->
        <el-pagination
          v-show="total>0"
          :current-page="queryParams.pageNum"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="queryParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
        <!-- 分页控件结束 -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { listMedicinesForPage } from '@/api/erp/medicine'
import { listInventoryLogForPage } from '@/api/erp/inventory'
import { selectAllProducter } from '@/api/erp/producter'

export default {
  filters: {
    // 保留两位小数
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 分页数据总条数
      total: 0,
      // 当前激活的tab
      activeName: 'medicinesTab',
      // 表格药品数据
      medicinesTableList: [],
      // 表格入库日志数据
      inventoryLogTableList: [],
      // 状态数据字典
      statusOptions: [],
      // 供应商数据
      providerOptions: [],
      // 药品类型数据
      medicineTypeOptions: [],
      // 处方类型数据
      prescriptionTypeOptions: [],
      // 生产厂家数据
      producterOptions: [],
      // 药品查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicineName: undefined,
        medicineType: undefined,
        keywords: undefined,
        prescriptionType: undefined,
        producterId: undefined,
        status: undefined
      },
      dateRange: [],
      // 入库日志查询参数
      queryLogParams: {
        pageNum: 1,
        pageSize: 10,
        purchaseId: undefined,
        medicinesName: undefined,
        medicinesType: undefined,
        producterId: undefined,
        prescriptionType: undefined
      }
    }
  },
  created() {
    // 加载生产厂家数据
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
    // 加载药品分类数据
    this.getDictDataByType('his_medicines_type').then(res => {
      this.medicineTypeOptions = res.data
    })
    // 加载处方类型数据
    this.getDictDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 加载状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 加载表格药品数据
    this.getMedicinesList()
  },
  methods: {
    // 点击tab调用的事件
    handleClick(tab, event) {
      if (this.activeName === 'medicinesTab') {
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.getInventoryLogList()
      }
    },
    // 查询药品表格数据
    getMedicinesList() {
      // 打开遮罩层
      this.loading = true
      listMedicinesForPage(this.queryParams).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 查询入库日志表格数据
    getInventoryLogList() {
      // 打开遮罩层
      this.loading = true
      listInventoryLogForPage(this.addDateRange(this.queryLogParams, this.dateRange)).then(res => {
        this.inventoryLogTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      if (this.activeName === 'medicinesTab') {
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.getInventoryLogList()
      }
    },
    // 重置查询
    resetQuery() {
      if (this.activeName === 'medicinesTab') {
        this.resetForm('queryForm')
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.resetForm('queryLogForm')
        this.dateRange = []
        this.getInventoryLogList()
      }
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      if (this.activeName === 'medicinesTab') {
        this.queryParams.pageSize = val
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.queryParams.pageSize = val
        this.getInventoryLogList()
      }
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      if (this.activeName === 'medicinesTab') {
        this.queryParams.pageNum = val
        this.getMedicinesList()
      } else if (this.activeName === 'inventoryLogTab') {
        this.queryParams.pageNum = val
        this.getInventoryLogList()
      }
    },
    // 生产厂家转换
    producterFormatter(row) {
      let producterName = ''
      this.producterOptions.filter(item => {
        if (parseInt(item.id) === parseInt(row.producterId)) {
          producterName = item.producterName
        }
      })
      return producterName
    },
    // 药品类型转换
    medicineFormatter(row) {
      return this.selectDictLabel(this.medicineTypeOptions, row.medicineType)
    },
    medicinesFormatter(row) {
      return this.selectDictLabel(this.medicineTypeOptions, row.medicinesType)
    },
    // 处方类型转换
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
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
