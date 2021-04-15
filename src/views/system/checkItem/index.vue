<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="项目名称" prop="itemName">
        <el-input
          v-model="queryParams.itemName"
          placeholder="请输入检查项目名称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="项目类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择检查项目类型"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in typeOptions"
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
      <el-form-item label="创建时间">
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
    <el-table v-loading="loading" border :data="checkItemTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="检查项目名称" align="center" prop="itemName" />
      <el-table-column label="关键字" align="center" prop="keywords" />
      <el-table-column label="项目单价" align="center" prop="unitPrice" />
      <el-table-column label="项目成本" align="center" prop="cost" />
      <el-table-column label="单位" align="center" prop="unit" />
      <el-table-column label="项目类型" align="center" prop="type" :formatter="typeFormatter" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="项目名称" prop="itemName">
          <el-input v-model="form.itemName" placeholder="请输入项目名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="项目类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio
              v-for="dict in typeOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            >
              {{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字" clearable size="small" />
        </el-form-item>
        <el-form-item label="项目单价" prop="unitPrice">
          <el-input-number v-model="form.unitPrice" placeholder="请输入项目单价" clearable size="small" />
        </el-form-item>
        <el-form-item label="项目成本" prop="cost">
          <el-input-number v-model="form.cost" placeholder="请输入项目成本" clearable size="small" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model="form.unit" placeholder="请输入单位" clearable size="small" />
        </el-form-item>
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
import { listCheckItemForPage, addCheckItem, updateCheckItem, getCheckItemById, deleteCheckItemByIds } from '@/api/system/checkItem'

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
      checkItemTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 检查项目类型
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        itemName: undefined,
        keywords: undefined,
        type: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        itemName: [
          { required: true, message: '项目名称不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '关键字不能为空', trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '项目单价不能为空', trigger: 'blur' }
        ],
        cost: [
          { required: true, message: '项目成本不能为空', trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '项目单位不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCheckItemList()
    // 加载检查项目类型
    this.getDictDataByType('his_inspection_type').then(res => {
      this.typeOptions = res.data
    })
    // 加载状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询表格数据
    getCheckItemList() {
      // 打开遮罩层
      this.loading = true
      listCheckItemForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.checkItemTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getCheckItemList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getCheckItemList()
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
      this.getCheckItemList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCheckItemList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 检查项目类型转换
    typeFormatter(row) {
      return this.selectDictLabel(this.typeOptions, row.type)
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加检查项目'
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const checkItemId = row.id || this.ids
      this.open = true
      this.reset()
      this.title = '修改检查项目'
      getCheckItemById(checkItemId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const checkItemIds = row.id || this.ids
      this.$confirm('此操作将永久删除检查项目数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteCheckItemByIds(checkItemIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getCheckItemList()
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
            addCheckItem(this.form).then(res => {
              this.open = false
              this.loading = false
              this.msgSuccess('添加成功')
              this.getCheckItemList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateCheckItem(this.form).then(res => {
              this.loading = false
              this.open = false
              this.msgSuccess('修改成功')
              this.getCheckItemList()
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
        itemName: undefined,
        keywords: undefined,
        unitPrice: 0.00,
        cost: 0.00,
        unit: undefined,
        type: undefined,
        status: '0'
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
