<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="科室名称" prop="deptName">
        <el-input
          v-model="queryParams.deptName"
          placeholder="请输入科室名称"
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
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="deptTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" prop="id" align="center" width="270" />
      <el-table-column label="科室名称" prop="deptName" align="center" />
      <el-table-column label="科室编号" prop="deptNumber" align="center" />
      <el-table-column label="当前挂号编号" prop="regNumber" align="center" />
      <el-table-column label="排序码" prop="orderNum" align="center" />
      <el-table-column label="负责人" prop="deptLeader" align="center" />
      <el-table-column label="联系电话" prop="leaderPhone" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->

    <!-- 分页组件开始 -->
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
    <!-- 分页组件结束 -->

    <!-- 添加修改对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="科室名称" prop="deptName">
          <el-input v-model="form.deptName" placeholder="请输入科室名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="科室编号" prop="deptNumber">
          <el-input v-model="form.deptNumber" placeholder="请输入科室编号" clearable size="small" />
        </el-form-item>
        <el-form-item label="当前挂号编号" prop="regNumber">
          <el-input-number v-model="form.regNumber" placeholder="请输入当前挂号编号" clearable size="small" />
        </el-form-item>
        <el-form-item label="负责人" prop="deptLeader">
          <el-input v-model="form.deptLeader" placeholder="请输入负责人" clearable size="small" />
        </el-form-item>
        <el-form-item label="联系电话" prop="leaderPhone">
          <el-input v-model="form.leaderPhone" placeholder="请输入联系电话" clearable size="small" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="orderNum">
          <el-input-number v-model="form.orderNum" placeholder="请输入显示顺序" clearable size="small" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              :value="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
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
import { listForPage, addDept, updateDept, getDeptById, deleteDeptByIds } from '@/api/system/dept'

export default {
  data() {
    return {
      // 是否启用遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 分页数据总条数
      total: 0,
      // 表格字典数据
      deptTableList: [],
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
        deptName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        deptName: [
          { required: true, message: '科室名称不能为空', trigger: 'blur' }
        ],
        deptNumber: [
          { required: true, message: '科室编号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDeptList()
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询表格数据
    getDeptList() {
      // 打开遮罩层
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.deptTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getDeptList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getDeptList()
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
      this.getDeptList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getDeptList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const deptId = row.id || this.ids
      this.open = true
      this.reset()
      getDeptById(deptId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const deptIds = row.id || this.ids
      this.$confirm('此操作将永久删除科室数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteDeptByIds(deptIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getDeptList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 保存
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.id === undefined) {
            // 添加科室信息
            addDept(this.form).then(res => {
              this.msgSuccess('添加成功')
              this.loading = false
              this.getDeptList()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改科室信息
            updateDept(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getDeptList()
              this.open = false
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
    },
    // 重置表单
    reset() {
      this.form = {
        id: undefined,
        deptName: undefined,
        deptNumber: undefined,
        regNumber: 0,
        orderNum: 0,
        deptLeader: undefined,
        leaderPhone: undefined,
        status: '0'
      }
      this.resetForm('form')
    }
  }
}
</script>

<style scoped>

</style>
