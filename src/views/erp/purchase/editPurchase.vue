<template>
  <div class="app-container">
    <!-- 按钮开始 -->
    <el-card class="box-card">
      <div style="text-align: right">
        <el-button type="primary" icon="el-icon-plus" :disabled="isSubmit" size="small" @click="handleAddMedicines">添加药品</el-button>
        <el-button type="success" icon="el-icon-s-operation" :disabled="isSubmit" size="small" @click="handleBatchSet">批量设置</el-button>
        <el-button type="warning" icon="el-icon-check" :disabled="isSubmit" size="small" @click="handleSubmit">暂存</el-button>
        <el-button type="danger" icon="el-icon-finished" :disabled="isSubmit" size="small" @click="handleSubmitAndAudit">提交审核</el-button>
      </div>
    </el-card>
    <!-- 按钮结束 -->

    <!-- 主表单开始 -->
    <el-card class="box-card">
      <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="88px">
        <el-row :gutter="10">
          <el-col :span="1.5">
            <el-form-item label="单据号" prop="id">
              <el-input
                v-model="form.id"
                placeholder="请输入单据号"
                :disabled="true"
                size="small"
                style="width:220px"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="供应商" prop="providerId">
              <el-select
                v-model="form.providerId"
                placeholder="请选择供应商"
                clearable
                :disabled="isSubmit"
                size="small"
                style="width:220px"
              >
                <el-option
                  v-for="d in providerOptions"
                  :key="d.id"
                  :label="d.providerName"
                  :value="d.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1.5">
            <el-form-item label="批发总金额" prop="purchaseTradeTotalAmount">
              <el-input
                v-model="form.purchaseTradeTotalAmount"
                placeholder="请输入批发总金额"
                :disabled="true"
                size="small"
                style="width:220px"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 主表单结束 -->

    <!-- 采购详情数据表格开始 -->
    <el-card class="box-card">
      <el-table
        :data="purchaseItemList"
        class="tb-edit"
        style="width: 100%"
        border
        highlight-current-row
      >
        <el-table-column label="药品ID" align="center" width="80px" prop="medicinesId" />
        <el-table-column label="药品名称" align="center" width="160" prop="medicinesName" />
        <el-table-column label="药品类型" align="center" width="160" prop="medicinesType" :formatter="medicinesTypeFormatter" />
        <el-table-column label="规格" align="center" width="80" prop="conversion">
          <template slot-scope="scope">
            <span> {{ scope.row.conversion }}{{ scope.row.unit }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生产厂家" align="center" width="220" prop="producterId" :formatter="producterFormatter" />
        <el-table-column label="采购数量" align="center" width="160" prop="purchaseNumber">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.purchaseNumber"
              :step="1"
              :min="0"
              size="small"
              :disabled="isSubmit"
            />
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center" width="80" prop="unit" />
        <el-table-column label="批发价" align="center" width="160" prop="tradePrice">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.tradePrice"
              :step="0.1"
              :min="0"
              :precision="2"
              size="small"
              :disabled="isSubmit"
            />
          </template>
        </el-table-column>
        <el-table-column label="批发总金额" align="center" width="100" prop="tradeTotalAmount">
          <template slot-scope="scope">
            <span>{{ scope.row.tradeTotalAmount|rounding }}</span>
          </template>
        </el-table-column>
        <el-table-column label="药品生产批次号" align="center" width="180" prop="batchNumber">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.batchNumber"
              size="small"
              :disabled="isSubmit"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" width="180" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
              :disabled="isSubmit"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" type="danger" :disabled="isSubmit" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 采购详情数据表格结束 -->

    <!-- 药品数据对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1300px"
      center
      append-to-body
    >
      <!-- 查询条件开始 -->
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <el-form-item label="药品名称" prop="medicineName">
          <el-input
            v-model="queryParams.medicineName"
            placeholder="请输入药品名称"
            clearable
            size="small"
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="药品类型" prop="medicineType">
          <el-select
            v-model="queryParams.medicineType"
            placeholder="请选择药品类型"
            clearable
            size="small"
            style="width:180px"
          >
            <el-option
              v-for="dict in medicinesTypeOptions"
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
            style="width:180px"
          />
        </el-form-item>
        <el-form-item label="处方类型" prop="prescriptionType">
          <el-select
            v-model="queryParams.prescriptionType"
            placeholder="请选择处方类型"
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 查询条件结束 -->

      <!-- 药品数据表格开始 -->
      <el-table ref="medicinesTableList" v-loading="loading" border :data="medicinesTableList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="药品ID" align="center" prop="id" />
        <el-table-column label="药品名称" align="center" prop="medicineName" />
        <el-table-column label="药品编号" align="center" prop="medicineNumber" />
        <el-table-column label="生产厂家" align="center" prop="producterId" :formatter="producterFormatter" />
        <el-table-column label="药品类型" align="center" prop="medicineType" :formatter="medicineFormatter" />
        <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
        <el-table-column label="关键字" align="center" prop="keywords" />
      </el-table>
      <!-- 药品数据表格结束 -->

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
    </el-dialog>
    <!-- 药品数据对话框结束 -->

    <!-- 批量设置对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="batchSetOpen"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="batchSetForm" :model="batchSetForm" label-width="110px">
        <el-form-item label="采购数量" prop="purchaseNumber">
          <el-input-number v-model="batchSetForm.purchaseNumber" :min="0" placeholder="请输入采购数量" size="small" />
        </el-form-item>
        <el-form-item label="批发价" prop="tradePrice">
          <el-input-number v-model="batchSetForm.tradePrice" :precision="2" :min="0" placeholder="请输入批发价" size="small" />
        </el-form-item>
        <el-form-item label="药品生产批次号" prop="batchNumber">
          <el-input v-model="batchSetForm.batchNumber" placeholder="请输入药品生产批次号" size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="batchSetForm.remark" placeholder="请输入备注" size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleBatchSetSubmit">确定</el-button>
        <el-button @click="cancelBatchSet">取消</el-button>
      </span>
    </el-dialog>
    <!-- 批量设置对话框结束 -->
  </div>
</template>

<script>
import { selectAllProvider } from '@/api/erp/provider'
import { listMedicinesForPage } from '@/api/erp/medicine'
import { selectAllProducter } from '@/api/erp/producter'
import { addPurchase, addPurchaseToAudit, queryPurchaseAndItemByPurchaseId } from '@/api/erp/purchase'

export default {
  filters: {
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 是否打开对话框
      open: false,
      // 总条数
      total: 0,
      // 对话框标题
      title: '',
      // 是否已提交
      isSubmit: false,
      // 供应商数据
      providerOptions: [],
      // 生产厂家数据
      producterOptions: [],
      // 药品类型
      medicinesTypeOptions: [],
      // 处方类型
      prescriptionTypeOptions: [],
      // 主表单数据
      form: {
        id: undefined,
        providerId: undefined,
        purchaseTradeTotalAmount: undefined
      },
      // 采购详情数据表格
      purchaseItemList: [],
      // 药品数据表格
      medicinesTableList: [],
      // 药品查询条件
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicineName: undefined,
        medicineType: undefined,
        keywords: undefined,
        prescriptionType: undefined
      },
      // 对话框选中的药品
      selectMedicines: [],
      // 是否打开批量设置对话框
      batchSetOpen: false,
      // 批量设置的数据表单
      batchSetForm: {
        purchaseNumber: 0,
        tradePrice: 0.00,
        batchNumber: '',
        remark: ''
      },
      // 表单校验
      rules: {
        providerId: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      }
    }
  },
  // 监听purchaseItemList里面的数据变化，更新总批发额
  watch: {
    purchaseItemList: {
      handler: function() {
        this.form.purchaseTradeTotalAmount = 0.00
        this.purchaseItemList.filter(item => {
          item.tradeTotalAmount = item.tradePrice * item.purchaseNumber
          this.form.purchaseTradeTotalAmount += item.tradeTotalAmount
        })
      },
      deep: true
    }
  },
  created() {
    // 加载供应商数据
    selectAllProvider().then(res => {
      this.providerOptions = res.data
    })
    // 根据单据ID加载采购数据和详情数据
    const purchaseId = this.$route.params && this.$route.params.id
    queryPurchaseAndItemByPurchaseId(purchaseId).then(res => {
      this.form = res.data.purchase
      this.form.providerId = parseInt(this.form.providerId)
      this.purchaseItemList = res.data.items

      // 如果当前单据状态为1或者4可以进行修改
      if (res.data.purchase.status === '1' || res.data.purchase.status === '4') {
        this.isSubmit = false
      } else {
        this.isSubmit = true
      }
    })
    // 加载生产厂家数据
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
    // 加载药品分类数据
    this.getDictDataByType('his_medicines_type').then(res => {
      this.medicinesTypeOptions = res.data
    })
    // 加载处方类型数据
    this.getDictDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
  },
  methods: {
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
    // 打开选择药品的对话框
    handleAddMedicines() {
      this.open = true
      this.title = '选择要添加的药品'
      this.getMedicinesList()
    },
    // 查询药品数据
    getMedicinesList() {
      this.loading = true
      listMedicinesForPage(this.queryParams).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
        this.$nextTick(() => {
          this.medicinesTableList.filter(r1 => {
            this.purchaseItemList.filter(r2 => {
              if (parseInt(r1.id) === parseInt(r2.medicinesId)) {
                this.$refs.medicinesTableList.toggleRowSelection(r1, true)
              }
            })
          })
        })
      })
    },
    // 条件查询
    handleQuery() {
      this.getMedicinesList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getMedicinesList()
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getMedicinesList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getMedicinesList()
    },
    // 药品类型转换
    medicineFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicineType)
    },
    medicinesTypeFormatter(row) {
      return this.selectDictLabel(this.medicinesTypeOptions, row.medicinesType)
    },
    // 处方类型转换
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
    },
    // 数据表格多选时触发
    handleSelectionChange(selection) {
      this.selectMedicines = selection
      this.selectMedicines.filter(i => {
        let flag = false
        // 判断purchaseItemList里有没有已选择的ID
        this.purchaseItemList.filter(item => {
          if (parseInt(i.id) === parseInt(item.medicinesId)) {
            flag = true
          }
        })
        // 如果没有则放入purchaseItemList中
        if (!flag) {
          // TODO
          this.purchaseItemList.push(JSON.parse(JSON.stringify(i)))
        }
      })
      // 数据提取
      this.purchaseItemList.filter(m => {
        this.$delete(m, 'status')
        this.$delete(m, 'medicinesStockNum')
        this.$delete(m, 'medicinesStockDangerNum')
        this.$delete(m, 'createTime')
        this.$delete(m, 'updateTime')
        this.$delete(m, 'createBy')
        this.$delete(m, 'updateBy')

        this.$set(m, 'purchaseNumber', m.purchaseNumber ? m.purchaseNumber : 0)
        this.$set(m, 'tradePrice', m.tradePrice ? m.tradePrice : 0.00)
        this.$set(m, 'tradeTotalAmount', m.tradeTotalAmount ? m.tradeTotalAmount : 0.00)
        this.$set(m, 'batchNumber', m.batchNumber ? m.batchNumber : '')
        this.$set(m, 'remark', m.remark ? m.remark : '')
        this.$set(m, 'medicinesId', m.id ? m.id : '')
        this.$set(m, 'medicinesName', m.medicineName ? m.medicineName : '')
        this.$set(m, 'medicinesType', m.medicineType ? m.medicineType : '')
      })
    },
    // 打开批量设置的对话框
    handleBatchSet() {
      this.batchSetOpen = true
      this.title = '批量设置'
    },
    // 批量设置保存
    handleBatchSetSubmit() {
      this.purchaseItemList.filter(item => {
        item.purchaseNumber = this.batchSetForm.purchaseNumber
        item.tradePrice = this.batchSetForm.tradePrice
        item.batchNumber = this.batchSetForm.batchNumber
        item.remark = this.batchSetForm.remark
      })
      this.batchSetOpen = false
    },
    // 批量设置对话框关闭
    cancelBatchSet() {
      this.batchSetOpen = false
    },
    // 暂存
    handleSubmit() {
      if (this.purchaseItemList.length > 0) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            const purchaseFormDto = {
              'purchaseDto': this.form,
              'purchaseItemDtoList': this.purchaseItemList
            }
            addPurchase(purchaseFormDto).then(res => {
              this.msgSuccess('暂存成功')
              this.loading = false
            }).catch(() => {
              this.msgError('暂存失败')
              this.loading = false
            })
          }
        })
      } else {
        this.msgError('药品数据项不能为空')
      }
    },
    // 保存并提交审核
    handleSubmitAndAudit() {
      if (this.purchaseItemList.length > 0) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            const purchaseFormDto = {
              'purchaseDto': this.form,
              'purchaseItemDtoList': this.purchaseItemList
            }
            addPurchaseToAudit(purchaseFormDto).then(res => {
              this.msgSuccess('提交审核成功')
              this.loading = false
              this.isSubmit = true
            }).catch(() => {
              this.msgError('提交审核失败')
              this.loading = false
            })
          }
        })
      } else {
        this.msgError('药品数据项不能为空')
      }
    },
    // 删除采购详情数据
    handleDelete(index, row) {
      this.purchaseItemList.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
