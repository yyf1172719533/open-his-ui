<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="角色名称" prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="权限编码" prop="roleCode">
        <el-input
          v-model="queryParams.roleCode"
          placeholder="请输入权限编码"
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
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-s-custom" size="mini" :disabled="single" @click="handleSelectMenu">分配权限</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="roleTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色ID" prop="id" align="center" />
      <el-table-column label="角色名称" prop="roleName" align="center" />
      <el-table-column label="权限编码" prop="roleCode" align="center" />
      <el-table-column label="显示顺序" prop="roleSort" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="备注" prop="remark" align="center" />
      <el-table-column label="创建时间" prop="createTime" align="center" width="180" />
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-s-custom" size="mini" @click="handleSelectMenu(scope.row)">分配权限</el-button>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable size="small" />
        </el-form-item>
        <el-form-item label="权限编码" prop="roleCode">
          <el-input v-model="form.roleCode" placeholder="请输入权限编码" clearable size="small" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="roleSort">
          <el-input-number v-model="form.roleSort" clearable size="small" />
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
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改对话框结束 -->

    <!-- 分配权限对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="selectMenuOpen"
      width="400px"
      center
      append-to-body
    >
      <el-tree
        ref="menu"
        :data="menuOptions"
        show-checkbox
        node-key="id"
        highlight-current
        empty-text="加载中，请稍后..."
        :props="{ id: 'id', label: 'menuName', children: 'children' }"
      />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitSelectMenu">确 定</el-button>
        <el-button @click="cancelSelectMenu">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框结束 -->
  </div>
</template>

<script>
import { listForPage, addRole, updateRole, getRoleById, deleteRoleByIds, saveRoleMenu } from '@/api/system/role'

import { selectMenuTree, getMenuIdsByRoleId } from '@/api/system/menu'

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
      // 表格角色数据
      roleTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 是否打开分配权限对话框
      selectMenuOpen: false,
      // 菜单树数据
      menuOptions: [],
      // 当前选中的角色ID
      currentRoleId: undefined,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleCode: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '权限编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
  },
  methods: {
    // 查询表格数据
    getRoleList() {
      // 打开遮罩层
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.roleTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getRoleList()
    },
    // 重置
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getRoleList()
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
      this.getRoleList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getRoleList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加角色信息'
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const roleId = row.id || this.ids
      this.open = true
      this.reset()
      this.title = '修改角色信息'
      getRoleById(roleId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const roleIds = row.id || this.ids
      this.$confirm('此操作将永久删除角色数据,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteRoleByIds(roleIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getRoleList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 分配权限
    handleSelectMenu(row) {
      this.currentRoleId = row.id || this.ids[0]
      this.title = '分配菜单权限'
      this.selectMenuOpen = true
      // 查询可用的菜单
      selectMenuTree().then(res => {
        this.menuOptions = this.handleTree(res.data, 'id')
      })
      // 根据角色ID查询当前角色拥有的菜单权限
      getMenuIdsByRoleId(this.currentRoleId).then(res => {
        this.$refs.menu.setCheckedKeys(res.data)
      })
    },
    // 提交
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 添加
          this.loading = true
          if (this.form.id === undefined) {
            addRole(this.form).then(res => {
              this.msgSuccess('添加成功')
              this.open = false
              this.loading = false
              this.getRoleList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateRole(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getRoleList()
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
      this.title = ''
    },
    // 重置表单
    reset() {
      this.form = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        roleSort: 0,
        remark: undefined,
        status: '0'
      }
      this.resetForm('form')
    },
    // 保存角色和菜单之间的关系
    handleSubmitSelectMenu() {
      // 获取选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys()
      // 获取半选的节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 组合节点
      const finalCheckedKeys = halfCheckedKeys.concat(checkedKeys)
      saveRoleMenu(this.currentRoleId, finalCheckedKeys).then(res => {
        this.msgSuccess('分配菜单权限成功')
        this.selectMenuOpen = false
      }).catch(() => {
        this.msgSuccess('分配菜单权限失败')
        this.selectMenuOpen = false
      })
    },
    // 关闭分配菜单权限的对话框
    cancelSelectMenu() {
      this.selectMenuOpen = false
      this.menuOptions = []
    }
  }
}
</script>

<style scoped>

</style>
