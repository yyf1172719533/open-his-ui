<template>
  <div class="app-container">
    <!-- 查询条件开始 -->
    <el-card>
      <el-form ref="queryForm" :model="queryParams" label-width="68px" :inline="true">
        <el-form-item label="检查项目" prop="checkItemIds">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;" />
          <el-checkbox-group v-model="queryParams.checkItemIds" @change="handleCheckedItemsChange">
            <el-checkbox
              v-for="d in checkItemOptions"
              :key="d.id"
              :label="d.id"
              :value="d.id"
            >{{ d.itemName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="挂号单ID" prop="regId">
          <el-input
            v-model="queryParams.regId"
            placeholder="请输入挂号单ID"
            clearable
            size="small"
            style="width: 250px;margin-right: 20px"
          />
        </el-form-item>
        <el-form-item label="患者名称" prop="patientName">
          <el-input
            v-model="queryParams.patientName"
            placeholder="请输入患者名称"
            clearable
            size="small"
            style="width: 250px;margin-right: 20px"
          />
          <el-button type="primary" icon="el-icon-search" round size="mini" @click="handleQuery">查询</el-button>
          <el-button type="success" icon="el-icon-refresh" round size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询条件结束 -->

    <!-- 数据表格开始 -->
    <el-card style="margin-top: 5px">
      <el-table ref="refTable" v-loading="loading" border :data="checkResultTableList">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="项目价格:">
                <span>{{ props.row.itemPrice }}</span>
              </el-form-item>
              <el-form-item label="检查时间:">
                <span>{{ props.row.createTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="检查单号" align="center" prop="id" />
        <el-table-column label="挂号单号" align="center" prop="regId" />
        <el-table-column label="项目名称" align="center" prop="itemName" />
        <el-table-column label="患者名称" align="center" prop="patientName" />
        <el-table-column label="检查状态" align="center" prop="resultStatus" :formatter="statusFormatter" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="handleUploadResult(scope.row)">录入结果</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
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

    <!-- 检查结果录入对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="1000px"
      center
      append-to-body
    >
      <el-form ref="form" :model="checkResultForm" label-width="80px">
        <el-form-item label="检查结果" prop="resultMsg">
          <el-input
            v-model="checkResultForm.resultMsg"
            clearable
            type="textarea"
            :rows="6"
            placeholder="请输入检查结果"
          />
        </el-form-item>
        <el-form-item label="附件上传" prop="resultImg">
          <el-upload
            :action="uploadPath"
            :headers="headers"
            :multiple="true"
            accept="image/*"
            name="mf"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-remove="beforeRemove"
          >
            <i class="el-icon-plus" />
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 检查结果录入对话框结束 -->
  </div>
</template>

<script>
import { queryAllCheckingResultForPage, completeCheckResult } from '@/api/doctor/checkResult'
import { selectAllCheckItem } from '@/api/system/checkItem'
import { getToken } from '@/utils/auth'
import { deleteFile } from '@/api/system/upload'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 是否全选
      checkAll: true,
      // 检查项目数据
      checkItemOptions: [],
      // 是否半选
      isIndeterminate: false,
      queryParams: {
        regId: undefined,
        checkItemIds: [],
        pageNum: 1,
        pageSize: 10
      },
      // 检查表格数据
      checkResultTableList: [],
      // 总条数
      total: 0,
      // 检查状态数据
      resultStatusOptions: [],
      // 检查结果录入对话框标题
      title: '',
      // 是否打开对话框
      open: false,
      // 检查结果传输对象
      checkResultForm: {
        id: undefined,
        resultMsg: undefined,
        resultImg: undefined
      },
      // 文件上传路径
      uploadPath: undefined,
      // 请求头
      headers: undefined,
      // 文件预览对话框
      dialogVisible: false,
      // 文件预览url地址
      dialogImageUrl: '',
      // 文件列表json对象
      fileListJsonObj: []
    }
  },
  created() {
    selectAllCheckItem().then(res => {
      this.checkItemOptions = res.data
      this.queryParams.checkItemIds = res.data.map(item => item.id)
      this.getCheckingResult()
    })
    // 加载检查结果状态
    this.getDictDataByType('his_check_result_status').then(res => {
      this.resultStatusOptions = res.data
    })
    // 加载文件上传路径
    this.uploadPath = process.env.VUE_APP_BASE_API + '/system/upload/doUploadImage'
    // 设置请求头信息
    this.headers = { 'token': getToken() }
  },
  methods: {
    // 查询检查中的数据
    getCheckingResult() {
      this.loading = true
      queryAllCheckingResultForPage(this.queryParams).then(res => {
        this.checkResultTableList = res.data
        this.total = res.total
        this.loading = false
      })
    },
    // 全选
    handleCheckAllChange(val) {
      this.queryParams.checkItemIds = val ? this.checkItemOptions.map(item => item.id) : []
      this.isIndeterminate = false
    },
    // 选择某一个检查项目
    handleCheckedItemsChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.checkItemOptions.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkItemOptions.length
    },
    // 分页pageSize时触发
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getCheckingResult()
    },
    // 点击上一页 下一页 跳转页时触发
    handleCurrentChange(val) {
      this.queryParams.pageNum = val
      this.getCheckingResult()
    },
    // 查询
    handleQuery() {
      this.getCheckingResult()
    },
    // 重置
    handleReset() {
      this.resetForm('queryForm')
      this.queryParams.checkItemIds = this.checkItemOptions.map(item => item.id)
      this.getCheckingResult()
    },
    // 检查结果状态转换
    statusFormatter(row) {
      return this.selectDictLabel(this.resultStatusOptions, row.resultStatus)
    },
    // 检查结果录入
    handleUploadResult(row) {
      this.open = true
      this.title = '录入【' + row.patientName + '】的【' + row.itemName + '】检查结果'
      this.checkResultForm.id = row.id
    },
    // 文件预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response.data.url
      this.dialogVisible = true
    },
    // 文件移除
    handleRemove(file) {
      this.fileListJsonObj.filter(r => {
        if (r.url === file.response.data.url) {
          this.fileListJsonObj.splice(this.fileListJsonObj.indexOf(r), 1)
          // 将服务器上的文件删除
          const params = {
            filePath: r.url
          }
          deleteFile(params).then(res => {
            this.msgSuccess('删除成功')
          })
        }
      })
    },
    // 文件上传成功之后的回调
    handleSuccess(response) {
      this.fileListJsonObj.push(response.data)
    },
    // 文件上传失败之后的回调
    handleError() {
      this.msgError('文件上传失败')
    },
    // 文件删除之前的回调
    beforeRemove(file) {
      if (file && file.status === 'success') {
        return this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
          // eslint-disable-next-line no-undef
          reject(false)
        })
      }
    },
    // 提交检查结果
    handleSubmit() {
      return this.$confirm('是否提交录入的检查结果, 提交后不可修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkResultForm.resultImg = JSON.stringify(this.fileListJsonObj)
        completeCheckResult(this.checkResultForm).then(res => {
          this.msgSuccess('提交成功')
          this.cancel()
          this.getCheckingResult()
        })
      })
    },
    // 取消
    cancel() {
      this.open = false
      this.title = ''
      this.checkResultForm = {
        id: undefined,
        resultMsg: undefined,
        resultImg: undefined
      }
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
