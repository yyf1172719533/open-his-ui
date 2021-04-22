<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="厂家名称" prop="producterName">
        <el-input
          v-model="queryParams.producterName"
          placeholder="请输入厂家名称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="厂家代码" prop="producterCode">
        <el-input
          v-model="queryParams.producterCode"
          placeholder="请输入厂家代码"
          clearable
          size="small"
          style="width:240px"
        />
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
      <el-form-item label="厂家电话" prop="producterPhone">
        <el-input
          v-model="queryParams.producterPhone"
          placeholder="请输入厂家电话"
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
    <el-table v-loading="loading" border :data="producterTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="厂家名称" align="center" prop="producterName" />
      <el-table-column label="厂家代码" align="center" prop="producterCode" />
      <el-table-column label="联系人" align="center" prop="producterPerson" />
      <el-table-column label="厂家电话" align="center" prop="producterPhone" />
      <el-table-column label="厂家地址" align="center" prop="producterAddress" />
      <el-table-column label="关键字" align="center" prop="keywords" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" />
      <el-table-column label="操作" align="center" >
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
      width="600px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="厂家名称" prop="producterName">
          <el-input v-model="form.producterName" placeholder="请输入厂家名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="厂家代码" prop="producterCode">
          <el-input v-model="form.producterCode" placeholder="请输入厂家代码" clearable size="small" />
        </el-form-item>
        <el-form-item label="联系人" prop="producterPerson">
          <el-input v-model="form.producterPerson" placeholder="请输入联系人" clearable size="small" />
        </el-form-item>
        <el-form-item label="厂家电话" prop="producterPhone">
          <el-input v-model="form.producterPhone" placeholder="请输入厂家电话" clearable size="small" />
        </el-form-item>
        <el-form-item label="关键字" prop="keywords">
          <el-input v-model="form.keywords" placeholder="请输入关键字" clearable size="small" />
        </el-form-item>
        <el-form-item label="厂家地址" prop="producterAddress">
          <el-input v-model="form.producterAddress" placeholder="请输入厂家地址" clearable size="small" />
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
import { listProducterForPage, addProducter, updateProducter, getProducterById, deleteProducterByIds } from '@/api/erp/producter'

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
      producterTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        producterName: undefined,
        producterCode: undefined,
        producterPhone: undefined,
        keywords: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        producterName: [
          { required: true, message: '厂家名称不能为空', trigger: 'blur' }
        ],
        producterCode: [
          { required: true, message: '厂家代码不能为空', trigger: 'blur' }
        ],
        producterPerson: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        producterPhone: [
          { required: true, message: '厂家电话不能为空', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正常的手机号', trigger: 'blur' }
        ],
        producterAddress: [
          { required: true, message: '厂家地址不能为空', trigger: 'blur' }
        ],
        keywords: [
          { required: true, message: '查询关键字不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getProducterList()
    // 加载状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    getProducterList() {
      // 打开遮罩层
      this.loading = true
      listProducterForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.producterTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getProducterList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getProducterList()
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
      this.getProducterList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getProducterList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加生产厂家信息'
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const producterId = row.id || this.ids
      this.open = true
      this.reset()
      this.title = '修改生产厂家信息'
      getProducterById(producterId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const producterIds = row.id || this.ids
      this.$confirm('此操作将永久删除生产厂家数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteProducterByIds(producterIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getProducterList()
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
            addProducter(this.form).then(res => {
              this.open = false
              this.loading = false
              this.msgSuccess('添加成功')
              this.getProducterList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateProducter(this.form).then(res => {
              this.loading = false
              this.open = false
              this.msgSuccess('修改成功')
              this.getProducterList()
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
        producterName: undefined,
        producterCode: undefined,
        producterPhone: undefined,
        producterPerson: undefined,
        keywords: undefined,
        producterAddress: undefined,
        status: '0'
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
