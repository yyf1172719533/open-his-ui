<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="字典类型" prop="dictType">
        <el-select
          v-model="queryParams.dictType"
          placeholder="请选择字典类型"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in typeOptions"
            :key="dict.dictType"
            :label="dict.dictName"
            :value="dict.dictType"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input
          v-model="queryParams.dictLabel"
          placeholder="请输入字典标签"
          clearable
          size="small"
          style="width:240px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="字典状态"
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
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="dictDataTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编码" prop="dictCode" align="center" />
      <el-table-column label="字典标签" prop="dictLabel" align="center" />
      <el-table-column label="字典键值" prop="dictValue" align="center" />
      <el-table-column label="字典排序" prop="dictSort" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" :show-overflow-tooltip="true" />
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

    <!-- 添加和修改的对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" :disabled="true" size="small" />
        </el-form-item>
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入字典标签" clearable size="small" />
        </el-form-item>
        <el-form-item label="字典键值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入字典键值" clearable size="small" />
        </el-form-item>
        <el-form-item label="排序显示" prop="dictSort">
          <el-input-number v-model="form.dictSort" clearable size="small" :min="0" />
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
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入字典备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加和修改的对话框结束 -->
  </div>
</template>

<script>
import { listForPage, addDictData, updateDictData, deleteDictDataByIds, getDictDataByDictCode } from '@/api/system/dict/data'
import { getDictTypeById, selectAllDictType } from '@/api/system/dict/type'

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
      dictDataTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 类型数据字典
      typeOptions: [],
      // 默认选择的字典类型
      defaultDictType: undefined,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictLabel: undefined,
        dictType: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        dictLabel: [
          { required: true, message: '字典标签不能为空', trigger: 'blur' }
        ],
        dictValue: [
          { required: true, message: '字典键值不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 路由传参
    const dictId = this.$route.params && this.$route.params.id
    // 根据字典类型ID查询字典信息
    getDictTypeById(dictId).then(res => {
      this.queryParams.dictType = res.data.dictType
      this.defaultDictType = res.data.dictType
      // 分页查询字典数据
      this.getDictDataList()
    })
    // 查询所有字典类型
    selectAllDictType().then(res => {
      this.typeOptions = res.data
    })
  },
  methods: {
    // 查询字典数据
    getDictDataList() {
      this.loading = true
      listForPage(this.queryParams).then(res => {
        this.loading = false
        this.dictDataTableList = res.data
        this.total = res.total
      })
    },
    // 条件查询
    handleQuery() {
      this.getDictDataList()
    },
    // 重置条件查询
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.dictType = this.defaultDictType
      this.getDictDataList()
    },
    // 数据表格的多选择框选择时触发
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictCode)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getDictDataList()
    },
    // 上一页 下一页 跳转页触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getDictDataList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 重置表单
    reset() {
      this.form = {
        dictCode: undefined,
        dictLabel: undefined,
        dictValue: undefined,
        dictType: undefined,
        status: '0',
        dictSort: 0,
        remark: undefined
      }
      this.resetForm('form')
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.form.dictType = this.defaultDictType
    },
    // 打开修改的对话框
    handleUpdate(row) {
      this.open = true
      this.reset()
      const dictCode = row.dictCode || this.ids
      // 根据字典数据编码查询字典数据
      getDictDataByDictCode(dictCode).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const dictCodes = row.dictCode || this.ids
      this.$confirm('此操作将永久删除字典数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteDictDataByIds(dictCodes).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getDictDataList()// 全查询
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
          if (this.form.dictCode === undefined) {
            // 添加字典数据
            addDictData(this.form).then(res => {
              this.msgSuccess('添加成功')
              this.loading = false
              this.getDictDataList()
              this.open = false
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改字典数据
            updateDictData(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getDictDataList()
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
    }
  }
}
</script>
