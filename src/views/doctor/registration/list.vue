<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
      <el-form-item label="所属科室" prop="deptId">
        <el-select
          v-model="queryParams.deptId"
          placeholder="请选择所属科室"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in deptOptions"
            :key="d.id"
            :label="d.deptName"
            :value="d.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="患者名称" prop="patientName">
        <el-input
          v-model="queryParams.patientName"
          placeholder="请输入患者名称"
          clearable
          size="small"
          style="width: 200px"
        />
      </el-form-item>
      <el-form-item label="挂号类型" prop="schedulingType">
        <el-select
          v-model="queryParams.schedulingType"
          placeholder="请选择挂号类型"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in schedulingTypeOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号时段" prop="subsectionType">
        <el-select
          v-model="queryParams.subsectionType"
          placeholder="请选择挂号时段"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in subsectionTypeOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号状态" prop="regStatus">
        <el-select
          v-model="queryParams.regStatus"
          placeholder="请选择挂号状态"
          clearable
          size="small"
          style="width: 200px"
        >
          <el-option
            v-for="d in regStatusOptions"
            :key="d.dictValue"
            :label="d.dictLabel"
            :value="d.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂号时间" prop="visitDate">
        <el-date-picker
          v-model="queryParams.visitDate"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="date"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件结束 -->

    <!-- 数据表格开始 -->
    <el-table v-loading="loading" border :data="regTableList">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="挂号ID:">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="操作人:">
              <span>{{ props.row.createBy }}</span>
            </el-form-item>
            <el-form-item label="创建时间:">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="患者姓名" align="center" prop="patientName" />
      <el-table-column label="挂号科室" align="center" prop="deptId" :formatter="deptFormatter" />
      <el-table-column label="接诊医生" align="center" prop="doctorName" />
      <el-table-column label="挂号费用" align="center" prop="regAmount">
        <template slot-scope="scope">
          <span>{{ scope.row.regAmount|rounding }}</span>
        </template>
      </el-table-column>
      <el-table-column label="挂号编号" align="center" prop="regNumber" />
      <el-table-column label="状态" align="center" prop="regStatus" :formatter="regStatusFormatter" />
      <el-table-column label="就诊日期" align="center" prop="visitDate" />
      <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
      <el-table-column label="挂号时段" align="center" prop="subsectionType" :formatter="subsectionTypeFormatter" />
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button v-if="scope.row.regStatus === '0'" type="success" icon="el-icon-check" size="mini" @click="handleCollect(scope.row)">收费</el-button>
          <el-button v-if="scope.row.regStatus === '1'" type="danger" icon="el-icon-close" size="mini" @click="handleReturn(scope.row)">退号</el-button>
          <el-button v-if="scope.row.regStatus === '0'" type="danger" icon="el-icon-check" size="mini" @click="handleInvalid(scope.row)">作废</el-button>
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
  </div>
</template>

<script>
import { selectAllDept } from '@/api/system/dept'
import { queryRegistrationForPage } from '@/api/doctor/registration'

export default {
  // 过滤器
  filters: {
    // 保留两位小数
    rounding(value) {
      return value.toFixed(2)
    }
  },
  data() {
    return {
      // 是否打开遮罩层
      loading: false,
      // 总数
      total: 0,
      // 挂号列表数据
      regTableList: [],
      // 部门数据
      deptOptions: [],
      // 挂号类型数据
      schedulingTypeOptions: [],
      // 挂号状态数据
      regStatusOptions: [],
      // 挂号时段数据
      subsectionTypeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: undefined,
        patientName: undefined,
        schedulingType: undefined,
        subsectionType: undefined,
        regStatus: undefined,
        visitDate: new Date()
      }
    }
  },
  created() {
    // 加载部门数据
    selectAllDept().then(res => {
      this.deptOptions = res.data
    })
    // 加载挂号类型
    this.getDictDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载挂号时段
    this.getDictDataByType('his_subsection_type').then(res => {
      this.subsectionTypeOptions = res.data
    })
    // 加载挂号状态
    this.getDictDataByType('his_registration_status').then(res => {
      this.regStatusOptions = res.data
    })
    // 加载挂号列表数据
    this.getRegistrationList()
  },
  methods: {
    getRegistrationList() {
      this.loading = true
      this.queryParams.visitDate = this.moment(this.queryParams.visitDate).format('YYYY-MM-DD')
      queryRegistrationForPage(this.queryParams).then(res => {
        this.regTableList = res.data
        this.total = res.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 条件查询
    handleQuery() {
      this.getRegistrationList()
    },
    // 重置查询
    resetQuery() {
      this.resetForm('queryForm')
      this.getRegistrationList()
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getRegistrationList()
    },
    // 上一页 下一页 跳转页数时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getRegistrationList()
    },
    // 部门数据转换
    deptFormatter(row) {
      let deptName = ''
      this.deptOptions.filter(item => {
        if (item.id === row.deptId) {
          deptName = item.deptName
        }
      })
      return deptName
    },
    // 挂号类型转换
    schedulingTypeFormatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType)
    },
    // 挂号时段转换
    subsectionTypeFormatter(row) {
      return this.selectDictLabel(this.subsectionTypeOptions, row.subsectionType)
    },
    // 挂号状态转换
    regStatusFormatter(row) {
      return this.selectDictLabel(this.regStatusOptions, row.regStatus)
    },
    // 收费
    handleCollect() {
      // TODO
    },
    // 退号
    handleReturn() {
      // TODO
    },
    // 作废
    handleInvalid() {
      // TODO
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
