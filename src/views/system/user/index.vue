<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属科室" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择科室"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dept in deptOptions"
            :key="dept.id"
            :label="dept.deptName"
            :value="dept.id"
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
        <el-button type="success" icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-refresh-right" size="mini" :disabled="multiple" @click="handleResetPwd">
          重置密码
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-s-custom" size="mini" :disabled="single" @click="handleSelectRole">
          分配角色
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格工具按钮结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="userTableList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="邮箱:">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="技能:">
              <span>{{ props.row.strong }}</span>
            </el-form-item>
            <el-form-item label="荣誉:">
              <span>{{ props.row.honor }}</span>
            </el-form-item>
            <el-form-item label="简介:">
              <span>{{ props.row.introduction }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户ID" align="center" prop="id" />
      <el-table-column label="用户昵称" align="center" prop="userName" />
      <el-table-column label="部门" align="center" prop="deptId" :formatter="deptFormatter" />
      <el-table-column label="手机号码【登录账号】" width="180" align="center" prop="phone" />
      <el-table-column label="性别" align="center" prop="sex" :formatter="sexFormatter" />
      <el-table-column label="年龄" align="center" prop="age" />
      <el-table-column label="是否排班" align="center" prop="schedulingFlag" :formatter="schedulingFlagFormatter" />
      <el-table-column label="用户级别" prop="userRank" align="center" :formatter="userRankFormatter" />
      <el-table-column label="用户学历" prop="knowledge" align="center" :formatter="knowledgeFormatter" />
      <el-table-column label="状态" prop="status" align="center" :formatter="statusFormatter" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          <el-button type="text" icon="el-icon-s-custom" size="mini" @click="handleSelectRole(scope.row)">分配角色
          </el-button>
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
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="userName">
              <el-input v-model="form.userName" style="width: 240px" placeholder="请输入用户昵称" clearable size="small"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" style="width: 240px" placeholder="请输入手机号,作为登录账号" clearable size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属科室" prop="deptId">
              <el-select
                v-model="form.deptId"
                placeholder="请选择所属科室"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="dept in deptOptions"
                  :key="dept.id"
                  :label="dept.deptName"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户级别" prop="userRank">
              <el-select
                v-model="form.userRank"
                placeholder="请选择用户级别"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="userRank in userRankOptions"
                  :key="userRank.dictValue"
                  :label="userRank.dictLabel"
                  :value="userRank.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" clearable size="small"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学历" prop="knowledge">
              <el-select
                v-model="form.knowledge"
                placeholder="请选择学历"
                clearable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="knowledge in knowledgeOptions"
                  :key="knowledge.dictValue"
                  :label="knowledge.dictLabel"
                  :value="knowledge.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="form.sex">
                <el-radio
                  v-for="sex in sexOptions"
                  :key="sex.dictValue"
                  :label="sex.dictValue"
                  :value="sex.dictValue"
                >{{ sex.dictLabel }}
                </el-radio>
              </el-radio-group>
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
                >{{ dict.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否需要排班" prop="schedulingFlag">
              <el-radio-group v-model="form.schedulingFlag">
                <el-radio
                  v-for="dict in schedulingFlagOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  :value="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" style="width: 240px" placeholder="请输入邮箱" clearable size="small" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="技能" prop="strong">
              <el-input v-model="form.strong" type="textarea" placeholder="请输入用户技能" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="荣誉" prop="honor">
              <el-input v-model="form.honor" type="textarea" placeholder="请输入用户荣誉" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户简介" prop="introduction">
              <el-input v-model="form.introduction" type="textarea" placeholder="请输入用户简介" />
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

    <!-- 分配角色对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="selectRoleOpen"
      width="900px"
      center
      append-to-body
    >
      <el-table
        ref="roleListTable"
        v-loading="loading"
        border
        :data="roleTableList"
        @selection-change="handleRoleTableSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="角色ID" align="center" prop="id" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="权限编码" align="center" prop="roleCode" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitRoleSelect">确 定</el-button>
        <el-button @click="cancelRoleSelect">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框结束 -->
  </div>
</template>

<script>
import { listForPage, addUser, updateUser, getUserById, resetPwd, saveUserRole, deleteUserByIds } from '@/api/system/user'

import { selectAllDept } from '@/api/system/dept'

import { selectAllRole, getRoleIdsByUserId } from '@/api/system/role'

export default {
  data() {
    // 邮箱校验
    const validateEmail = (rule, value, callback) => {
      if (!(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(value))) {
        callback(new Error('邮箱格式错误'))
      } else {
        callback()
      }
    }
    // 手机号码校验
    const validatePhone = (rule, value, callback) => {
      if (!(/^1[34578]\d{9}$/.test(value))) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
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
      // 用户级别数据
      userRankOptions: [],
      // 用户学历数据
      knowledgeOptions: [],
      // 是否参与排班数据
      schedulingFlagOptions: [],
      // 选择角色ID
      roleIds: [],
      // 角色列表
      roleTableList: [],
      // 当前选中用户
      currentUserId: undefined,
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
        ],
        phone: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '所属科室不能为空', trigger: 'change' }
        ],
        userRank: [
          { required: true, message: '用户级别不能为空', trigger: 'change' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
    // 加载状态
    this.getDictDataByType('sys_normal_disable').then(res => {
      this.statusOptions = res.data
    })
    // 加载性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载用户级别
    this.getDictDataByType('sys_user_level').then(res => {
      this.userRankOptions = res.data
    })
    // 加载用户学历
    this.getDictDataByType('sys_user_background').then(res => {
      this.knowledgeOptions = res.data
    })
    // 加载是否需要排班
    this.getDictDataByType('sys_yes_no').then(res => {
      this.schedulingFlagOptions = res.data
    })
    // 查询可用的部门信息
    selectAllDept().then(res => {
      this.deptOptions = res.data
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
    // 条件查询
    handleQuery() {
      this.getUserList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getUserList()
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
      this.getUserList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getUserList()
    },
    // 状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.statusOptions, row.status)
    },
    // 性别转换
    sexFormatter(row) {
      return this.selectDictLabel(this.sexOptions, row.sex)
    },
    // 是否需要排班转换
    schedulingFlagFormatter(row) {
      console.log(row.schedulingFlag)
      return this.selectDictLabel(this.schedulingFlagOptions, row.schedulingFlag)
    },
    // 部门转换
    deptFormatter(row) {
      let deptName = ''
      this.deptOptions.filter(item => {
        if (parseInt(item.id) === parseInt(row.deptId)) {
          deptName = item.deptName
        }
      })
      return deptName
    },
    // 用户级别转换
    userRankFormatter(row) {
      return this.selectDictLabel(this.userRankOptions, row.userRank)
    },
    // 用户学历转换
    knowledgeFormatter(row) {
      return this.selectDictLabel(this.knowledgeOptions, row.knowledge)
    },
    // 打开添加的对话框
    handleAdd() {
      this.open = true
      this.reset()
      this.title = '添加用户信息'
    },
    // 打开修改的对话框
    handleUpdate(row) {
      const userId = row.id || this.ids
      this.open = true
      this.reset()
      this.title = '修改用户信息'
      getUserById(userId).then(res => {
        this.form = res.data
      })
    },
    // 删除
    handleDelete(row) {
      const userIds = row.id || this.ids
      this.$confirm('此操作将永久删除用户信息,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        deleteUserByIds(userIds).then(res => {
          this.loading = false
          this.msgSuccess('删除成功')
          this.getUserList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    // 打开分配角色对话框
    handleSelectRole(row) {
      this.currentUserId = row.id || this.ids[0]
      this.title = '分配角色权限'
      this.selectRoleOpen = true
      const m = this
      selectAllRole().then(res => {
        m.roleTableList = res.data
        this.$nextTick(() => {
          // 根据当前选中用户查询拥有的角色信息
          getRoleIdsByUserId(m.currentUserId).then(res => {
            res.data.filter(r1 => {
              m.roleTableList.filter(r2 => {
                if (r1 === r2.id) {
                  // 选中表格
                  m.$refs.roleListTable.toggleRowSelection(r2, true)
                }
              })
            })
          })
        })
      })
    },
    // 关闭分配角色对话框
    cancelRoleSelect() {
      this.selectRoleOpen = false
      this.title = ''
    },
    // 角色表格多选择框选择时触发
    handleRoleTableSelectionChange(selection) {
      this.roleIds = selection.map(item => item.id)
    },
    // 保存用户和角色之间的关系
    handleSubmitRoleSelect() {
      saveUserRole(this.currentUserId, this.roleIds).then(res => {
        this.selectRoleOpen = false
        this.msgSuccess('分配成功')
      }).catch(() => {
        this.selectRoleOpen = false
        this.msgSuccess('分配失败')
      })
    },
    // 提交
    handleSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // 添加
          this.loading = true
          if (this.form.id === undefined) {
            addUser(this.form).then(res => {
              this.open = false
              this.loading = false
              this.msgSuccess('添加成功')
              this.getUserList()
            }).catch(() => {
              this.loading = false
            })
          } else {
            // 修改
            updateUser(this.form).then(res => {
              this.loading = false
              this.open = false
              this.msgSuccess('修改成功')
              this.getUserList()
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
        userName: undefined,
        phone: undefined,
        sex: '0',
        age: 0,
        status: '0',
        email: undefined,
        strong: undefined,
        honor: undefined,
        introduction: undefined,
        schedulingFlag: '0'
      }
      this.resetForm('form')
    },
    // 重置密码
    handleResetPwd() {
      const userId = this.ids
      this.$confirm('是否重置所选用户的密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        resetPwd(userId).then(res => {
          this.loading = false
          this.msgSuccess('重置成功')
        })
      }).catch(() => {
        this.loading = false
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
