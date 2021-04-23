<template>
  <div class="app-container">
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

    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px;">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="medicinesTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="单位:">
              <span>{{ props.row.unit }}</span>
            </el-form-item>
            <el-form-item label="换算量:">
              <span>{{ props.row.conversion }}</span>
            </el-form-item>
            <el-form-item label="库存量:">
              <span>{{ props.row.medicineStockNum }}</span>
            </el-form-item>
            <el-form-item label="预警值:">
              <span>{{ props.row.medicineStockDangerNum }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="药品名称" align="center" prop="medicineName" />
      <el-table-column label="药品编号" align="center" prop="medicineNumber" />
      <el-table-column label="生产厂家" align="center" prop="producterId" :formatter="producterFormatter" />
      <el-table-column label="药品类型" align="center" prop="medicineType" :formatter="medicineFormatter" />
      <el-table-column label="处方类型" align="center" prop="prescriptionType" :formatter="prescriptionTypeFormatter" />
      <el-table-column label="药品价格" align="center" prop="medicinePrice" />
      <el-table-column label="关键字" align="center" prop="keywords" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-plus" size="mini" @click="handleUpdateStorage(scope.row)">调整库存</el-button>
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

    <!-- 添加修改对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="药品名称" prop="medicineName">
              <el-input v-model="form.medicineName" style="width:240px" placeholder="请输入药品名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品编号" prop="medicineNumber">
              <el-input v-model="form.medicineNumber" style="width:240px" placeholder="请输入药品编号" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="药品类型" prop="medicineType">
              <el-select
                v-model="form.medicineType"
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
          </el-col>
          <el-col :span="12">
            <el-form-item label="处方类型" prop="prescriptionType">
              <el-select
                v-model="form.prescriptionType"
                placeholder="请选择处方类型"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="dict in prescriptionTypeOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="关键字" prop="keywords">
              <el-input v-model="form.keywords" style="width:240px" placeholder="请输入关键字" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="unit">
              <el-input v-model="form.unit" style="width:240px" placeholder="请输入单位" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="换算量" prop="conversion">
              <el-input v-model="form.conversion" style="width:240px" placeholder="请输入换算量" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="药品价格" prop="medicinePrice">
              <el-input-number v-model="form.medicinePrice" style="width:240px" placeholder="请输入药品价格" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="生产厂家" prop="producterId">
              <el-select
                v-model="form.producterId"
                placeholder="请选择生产厂家"
                clearable
                size="small"
                style="width:240px"
              >
                <el-option
                  v-for="dict in producterOptions"
                  :key="dict.id"
                  :label="dict.producterName"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预警值" prop="medicineStockDangerNum">
              <el-input-number v-model="form.medicineStockDangerNum" style="width:240px" placeholder="请输入预警值" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存量" prop="medicineStockNum">
              <el-input-number v-model="form.medicineStockNum" style="width:240px" placeholder="请输入库存量" size="small" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改对话框结束 -->
  </div>
</template>

<script>
import { listMedicinesForPage, addMedicines, updateMedicines, getMedicinesById, deleteMedicinesByIds, updateMedicinesStorage } from '@/api/erp/medicine'
import { selectAllProducter } from '@/api/erp/producter'

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
      medicinesTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 药品类型
      medicineTypeOptions: [],
      // 处方类型
      prescriptionTypeOptions: [],
      // 生产厂家
      producterOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        medicineName: undefined,
        medicineType: undefined,
        prescriptionType: undefined,
        producterId: undefined,
        keywords: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        medicineName: [
          { required: true, message: '药品名称不能为空', trigger: 'blur' }
        ],
        medicineType: [
          { required: true, message: '药品类型不能为空', trigger: 'change' }
        ],
        prescriptionType: [
          { required: true, message: '处方类型不能为空', trigger: 'change' }
        ],
        medicinePrice: [
          { required: true, message: '药品价格不能为空', trigger: 'blur' }
        ],
        producterId: [
          { required: true, message: '生产厂家不能为空', trigger: 'change' }
        ],
        keywords: [
          { required: true, message: '查询关键字不能为空', trigger: 'blur' }
        ],
        medicineStockDangerNum: [
          { required: true, message: '预警值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getMedicinesList()
    // 加载状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 加载药品类型
    this.getDictDataByType('his_medicines_type').then(res => {
      this.medicineTypeOptions = res.data
    })
    // 加载处方类型
    this.getDictDataByType('his_prescription_type').then(res => {
      this.prescriptionTypeOptions = res.data
    })
    // 加载生产厂家
    selectAllProducter().then(res => {
      this.producterOptions = res.data
    })
  },
  methods: {
    getMedicinesList() {
      // 打开遮罩层
      this.loading = true
      listMedicinesForPage(this.queryParams).then(res => {
        this.medicinesTableList = res.data
        this.total = res.total
        this.loading = false
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
    // 数据表格多选时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 药品类型转换
    medicineFormatter(row) {
      return this.selectDictLabel(this.medicineTypeOptions, row.medicineType)
    },
    // 处方类型转换
    prescriptionTypeFormatter(row) {
      return this.selectDictLabel(this.prescriptionTypeOptions, row.prescriptionType)
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
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加药品信息'
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const medicineId = row.id || this.ids
      this.open = true
      this.reset()
      this.title = '修改药品信息'
      getMedicinesById(medicineId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const medicinesId = row.id || this.ids
      this.$confirm('此操作将永久删除药品信息数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteMedicinesByIds(medicinesId).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getMedicinesList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 提交
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 添加
          this.loading = true
          if (this.form.id === undefined) {
            addMedicines(this.form).then(res => {
              this.open = false
              this.loading = false
              this.msgSuccess('添加成功')
              this.getMedicinesList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateMedicines(this.form).then(res => {
              this.loading = false
              this.open = false
              this.msgSuccess('修改成功')
              this.getMedicinesList()
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
    },
    // 重置表单
    reset() {
      this.form = {
        id: undefined,
        medicineName: undefined,
        medicineNumber: undefined,
        medicineType: undefined,
        prescriptionType: undefined,
        keywords: undefined,
        unit: undefined,
        conversion: undefined,
        medicinePrice: 0.00,
        producterId: undefined,
        medicineStockNum: 0,
        medicineStockDangerNum: 0,
        status: '0'
      }
      this.resetForm('form')
    },
    // 调整库存
    handleUpdateStorage(row) {
      this.$prompt('请输入要调整【' + row.medicineName + '】的库存值', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^-?\d+$/,
        inputErrorMessage: '库存值输入不正确'
      }).then(({ value }) => {
        updateMedicinesStorage(row.id, value).then(res => {
          this.msgSuccess('调整成功')
          this.getMedicinesList()
        }).catch(() => {
          this.msgSuccess('调整失败')
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
