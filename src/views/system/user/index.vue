<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属部门" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择部门"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in deptOptions"
            :key="dict.deptId"
            :label="dict.deptName"
            :value="dict.deptId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="用户昵称" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户昵称"
          clearable
          size="small"
          style="width:200px"
        />
      </el-form-item>
      <el-form-item label="用户性别" prop="sex">
        <el-select
          v-model="queryParams.sex"
          placeholder="请选择用户性别"
          clearable
          size="small"
          style="width:240px"
        >
          <el-option
            v-for="dict in sexOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
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
        <el-button type="danger" icon="el-icon-refresh-right" size="mini" :disabled="multiple" @click="handleResetPwd">重置密码</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-s-custom" size="mini" :disabled="single" @click="handleSelectRole">分配角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->
  </div>
</template>

<script>
import { listForPage, addUser, updateUser, getUserById, resetPwd, saveUserRole, deleteUserByIds } from '@/api/system/user'

import { selectAllDept } from '@/api/system/dept'

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
      // 表格用户数据
      userTableList: [],
      // 对话框标题
      title: '',
      // 是否显示对话框
      open: false,
      // 是否打开分配角色对话框
      selectRoleOpen: false,
      // 状态数据字典
      statusOptions: [],
      // 日期范围
      dateRange: [],
      // 部门数据
      deptOptions: [],
      // 性别数据
      sexOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        userName: undefined,
        phone: undefined,
        sex: undefined,
        status: undefined
      },
      // 表单数据
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
    this.getDeptList()
    // 查询状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 查询性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
  },
  methods: {
    // 查询表格数据
    getUserList() {
      // 打开遮罩层
      this.loading = true
      listForPage(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.userTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 查询可用的部门信息
    getDeptList() {
      selectAllDept().then(res => {
        this.deptOptions = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
