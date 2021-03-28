<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
          v-model="queryParams.menuName"
          placeholder="请输入菜单名称"
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 表格工具按钮开始 -->
    <el-row :gutter="10" style="margin-bottom: 8px">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table
      v-loading="loading"
      :data="menuTableList"
      border
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" prop="menuName" align="left" />
      <el-table-column label="菜单类型" prop="menuType" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.menuType === 'M' ? 'primary':scope.row.menuType === 'C' ? 'danger':'success'"
          >
            {{ scope.row.menuType === 'M' ? '目录':scope.row.menuType === 'C' ? '菜单':'权限' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="路由地址" prop="url" align="center" />
      <el-table-column label="权限标识" prop="perCode" align="center" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" prop="createTime" align="center" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)">新增</el-button>
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 数据表格结束 -->

    <!-- 添加修改对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      center
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentName">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :show-count="true"
                :normalizer="normalizer"
                placeholder="请选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由地址" prop="url">
              <el-input v-model="form.url" placeholder="请输入路由地址" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.menuType === 'F'" label="权限标识" prop="perCode">
              <el-input v-model="form.perCode" placeholder="请输入权限标识" clearable size="small" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >
                  {{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </el-dialog>
    <!-- 添加修改对话框结束 -->
  </div>
</template>

<script>

// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

import { listAllMenus, selectMenuTree, addMenu, updateMenu, getMenuById, deleteMenuById } from '@/api/system/menu'

export default {
  components: {
    Treeselect
  },
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 表格菜单数据
      menuTableList: [],
      // 菜单树数据
      menuOptions: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    // 查询状态字典数据
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 加载菜单数据
    this.getMenuList()
  },
  methods: {
    // 查询表格数据
    getMenuList() {
      // 打开遮罩层
      this.loading = true
      listAllMenus(this.queryParams).then(res => {
        this.menuTableList = this.handleTree(res.data, 'id')
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getMenuList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getMenuList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 重置
    reset() {
      this.form = {
        id: undefined,
        parentId: 0,
        menuName: undefined,
        url: undefined,
        perCode: undefined,
        menuType: 'M',
        remark: undefined,
        status: '0'
      }
    },
    // 新增
    handleAdd(row) {
      this.reset()
      this.getTreeSelect()
      if (row != null) {
        this.form.parentId = row.id
        if (row.menuType === 'M') {
          this.form.menuType = 'C'
        } else if (row.menuType === 'C') {
          this.form.menuType = 'F'
        }
      }
      this.open = true
      this.title = '添加菜单权限'
    },
    // 修改
    handleUpdate(row) {
      this.reset()
      this.getTreeSelect()
      getMenuById(row.id).then(res => {
        this.form = res.data
        this.open = true
        this.title = '修改菜单权限'
      })
    },
    // 删除
    handleDelete(row) {
      const id = row.id
      this.$confirm('此操作将永久删除菜单权限数据,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteMenuById(id).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getMenuList()
        }).catch(() => {
          this.loading = false
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
            addMenu(this.form).then(res => {
              this.msgSuccess('保存成功')
              this.open = false
              this.loading = false
              this.getMenuList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateMenu(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.loading = false
              this.getMenuList()
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
    // 查询菜单下拉树数据
    getTreeSelect() {
      selectMenuTree().then(res => {
        this.menuOptions = []
        const menu = { id: 0, menuName: '主类目', children: [] }
        menu.children = this.handleTree(res.data, 'id')
        console.log(menu)
        this.menuOptions.push(menu)
      })
    },
    // 自定义键名
    normalizer(node) {
      // 去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.menuName,
        children: node.children
      }
    }
  }
}
</script>

<style scoped>

</style>
