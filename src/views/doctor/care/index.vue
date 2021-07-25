<template>
  <div v-loading="loading" class="app-container">
    <!-- 门诊和急诊选项卡开始 -->
    <el-card style="margin-bottom: 5px;text-align: center">
      <el-radio-group v-model="schedulingType" @change="schedulingTypeChange">
        <el-radio-button
          v-for="dict in schedulingTypeOptions"
          :key="dict.dictValue"
          :label="dict.dictValue"
          :value="dict.dictValue"
        >
          {{ dict.dictLabel }}
        </el-radio-button>
      </el-radio-group>
    </el-card>
    <!-- 门诊和急诊选项卡结束 -->

    <!-- 底层卡片开始 -->
    <el-row :gutter="5">
      <!-- 左边患者信息开始 -->
      <el-col :span="7">
        <el-card>
          <el-form ref="form" :model="patientAllObj.patientObj" :inline="true" label-width="88px">
            <el-form-item label="患者姓名" prop="name">
              <el-input
                v-model="patientAllObj.patientObj.name"
                placeholder="请输入患者姓名"
                :disabled="true"
                style="width: 100%"
                size="small"
              >
                <el-button slot="append" icon="el-icon-user-solid" @click="viewRegistration" />
              </el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="cardNumber">
              <el-input
                v-model="patientAllObj.patientObj.cardNumber"
                placeholder="请输入身份证号"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者电话" prop="phone">
              <el-input
                v-model="patientAllObj.patientObj.phone"
                placeholder="请输入患者电话"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <el-radio-group v-model="patientAllObj.patientObj.sex">
                <el-radio
                  v-for="d in sexOptions"
                  :key="d.dictValue"
                  :label="d.dictValue"
                  :value="d.dictValue"
                  :disabled="true"
                >
                  {{ d.dictLabel }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="出生日期" prop="birthday">
              <el-date-picker
                v-model="patientAllObj.patientObj.birthday"
                style="width: 100%"
                size="small"
                :disabled="true"
                value-format="yyyy-MM-dd"
                type="date"
              />
            </el-form-item>
            <el-form-item label="患者年龄" prop="age">
              <el-input
                v-model="patientAllObj.patientObj.age"
                placeholder="请输入患者年龄"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="患者地址" prop="address">
              <el-input
                v-model="patientAllObj.patientObj.address"
                placeholder="请输入患者地址"
                :disabled="true"
                style="width: 100%"
                size="small"
              />
            </el-form-item>
            <el-form-item label="过敏信息" prop="allergyInfo">
              <el-input
                v-model="patientAllObj.patientObj.allergyInfo"
                placeholder="请输入过敏信息"
                type="textarea"
                :autosize="{ minRows: 2, maxRows:4 }"
                :disabled="true"
                maxlength="200"
                show-word-limit
                style="width: 100%"
                size="small"
              />
            </el-form-item>
          </el-form>
          <el-tabs :stretch="true" type="card">
            <el-tab-pane label="患者档案">
              <div v-if="patientAllObj.patientObj.isFinal === '1'">
                <div class="item">
                  紧急联系人:<span v-text="patientAllObj.patientFileObj.emergencyContactName" />
                </div>
                <div class="item">
                  紧急联系人电话:<span v-text="patientAllObj.patientFileObj.emergencyContactPhone" />
                </div>
                <div class="item">
                  紧急联系人关系:<span v-text="patientAllObj.patientFileObj.emergencyContactRelation" />
                </div>
                <div class="item">
                  左耳听力:<span v-text="patientAllObj.patientFileObj.leftEarHearing" />
                </div>
                <div class="item">
                  右耳听力:<span v-text="patientAllObj.patientFileObj.rightEarHearing" />
                </div>
                <div class="item">
                  左眼视力:<span v-text="patientAllObj.patientFileObj.leftVision" />
                </div>
                <div class="item">
                  右眼视力:<span v-text="patientAllObj.patientFileObj.rightVision" />
                </div>
                <div class="item">
                  身高:<span v-text="patientAllObj.patientFileObj.height" />
                </div>
                <div class="item">
                  体重:<span v-text="patientAllObj.patientFileObj.weight" />
                </div>
                <div class="item">
                  血型:<span v-text="patientAllObj.patientFileObj.bloodType" />
                </div>
                <div class="item">
                  个人史:<span v-text="patientAllObj.patientFileObj.personalInfo" />
                </div>
                <div class="item">
                  家族史:<span v-text="patientAllObj.patientFileObj.familyInfo" />
                </div>
                <div class="item">
                  档案创建时间:<span v-text="patientAllObj.patientFileObj.createTime" />
                </div>
                <div class="item">
                  档案更新时间:<span v-text="patientAllObj.patientFileObj.updateTime" />
                </div>
              </div>
              <div v-else style="text-align: center">
                暂无患者档案信息
              </div>
            </el-tab-pane>
            <el-tab-pane label="历史病历">
              <div v-if="patientAllObj.careHistoryObjList.length > 0">
                <el-collapse accordion>
                  <el-collapse-item v-for="(item, index) in patientAllObj.careHistoryObjList" :key="index">
                    <template slot="title">
                      就诊部门：【 {{ item.deptName }} 】  就诊时间：{{ item.visitDate }}
                    </template>
                    <div class="item">
                      主诉：{{ item.caseTitle }}
                    </div>
                    <div class="item">
                      发病日期：{{ item.caseDate }}
                    </div>
                    <div class="item">
                      诊断信息：{{ item.caseResult }}
                    </div>
                    <div class="item">
                      医生建议：{{ item.doctorTips }}
                    </div>
                    <div class="item">
                      备注：{{ item.remark }}
                    </div>
                    <div class="item">
                      接诊类型：{{ item.receiveType === '0' ? '初诊' : '复诊' }}
                    </div>
                    <div class="item">
                      是否传染：{{ item.isContagious === '0' ? '否' : '是' }}
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              <div v-else style="text-align: center">
                暂无历史病历信息
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 左边患者信息结束 -->

      <!-- 右边接诊信息开始 -->
      <el-col :span="17">
        <el-card>
          <el-row :gutter="5">
            <el-col :span="12">
              挂号单号：
              <span v-if="careHistory.regId === undefined" style="color: red;font-weight: bold">选择患者后显示</span>
              <span v-else style="color: red">{{ careHistory.regId }}</span>
              <br>
              病历编号：
              <span v-if="careHistory.id === undefined" style="color: red;font-weight: bold">保存病历后显示</span>
              <span v-else style="color: blue">{{ careHistory.id }}</span>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="primary" :disabled="careHistory.regId === undefined" v-show="careHistory.id === undefined" icon="el-icon-check" @click="handleSaveCareHistory">保存病历</el-button>
              <el-button type="primary" :disabled="careHistory.id === undefined" v-show="careHistory.id !== undefined" icon="el-icon-edit" @click="handleSaveCareHistory">修改病历</el-button>
              <el-button type="danger" :disabled="careHistory.regId === undefined" icon="el-icon-finished" @click="handleCompleteVisit">完成就诊</el-button>
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-top: 3px">
          <el-tabs v-model="careActiveName" type="card">
            <el-tab-pane label="病历" name="c1">
              <el-card>
                <el-form ref="form" :model="careHistory" :inline="true" label-width="88px">
                  <el-form-item label="发病日期" prop="caseDateObj">
                    <el-date-picker
                      v-model="caseDateObj"
                      value-format="yyyy-MM-dd"
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="接诊类型" prop="receiveType">
                    <el-select v-model="careHistory.receiveType" placeholder="接诊类型" size="small">
                      <el-option
                        v-for="dict in receiveTypeOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="是否传染" prop="isContagious">
                    <el-select v-model="careHistory.isContagious" placeholder="是否传染" size="small">
                      <el-option
                        v-for="dict in isContagiousOptions"
                        :key="dict.dictValue"
                        :label="dict.dictLabel"
                        :value="dict.dictValue"
                      />
                    </el-select>
                  </el-form-item>
                </el-form>
                <el-form ref="form" :model="careHistory" label-width="88px">
                  <el-form-item label="主诉" inline="false" prop="caseTitle">
                    <el-input
                      v-model="careHistory.caseTitle"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      placeholder="请输入主诉"
                      style="width: 100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="诊断信息" inline="false" prop="caseResult">
                    <el-input
                      v-model="careHistory.caseResult"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      placeholder="请输入诊断信息"
                      style="width: 100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="医生建议" inline="false" prop="doctorTips">
                    <el-input
                      v-model="careHistory.doctorTips"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      placeholder="请输入医生建议"
                      style="width: 100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                  <el-form-item label="备注" inline="false" prop="remark">
                    <el-input
                      v-model="careHistory.remark"
                      type="textarea"
                      :autosize="{ minRows: 4, maxRows: 6 }"
                      placeholder="请输入备注"
                      style="width: 100%"
                      maxlength="200"
                      show-word-limit
                      size="small"
                    />
                  </el-form-item>
                </el-form>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="处方" name="c2">
              <el-collapse v-if="prescriptionList.length > 0" accordion>
                <el-collapse-item v-for="(item, index) in prescriptionList" :key="index">
                  <template slot="title">
                    【{{ item.prescription.prescType === '0' ? '药用处方' : '检查处方' }}】
                    【{{ index + 1 }}】
                    【 处方总金额 】：￥{{ item.prescription.amount }}
                  </template>
                  <el-table v-loading="loading" border :data="item.prescriptionItemList">
                    <el-table-column label="序号" align="center" type="index" width="50" />
                    <el-table-column :label="item.prescription.prescType === '0' ? '药用名称' : '项目名称'" align="center" prop="itemName" />
                    <el-table-column label="数量" align="center" prop="num" />
                    <el-table-column label="单价（元）" align="center" prop="singlePrice" />
                    <el-table-column label="金额（元）" align="center" prop="amount" />
                    <el-table-column label="备注" align="center" prop="remark" />
                    <el-table-column label="状态" align="center" prop="status" :formatter="orderStatusFormatter" />
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button v-show="scope.row.status === '0'" type="text" icon="el-icon-delete" size="mini" @click="handleDeletePrescriptionItemByItemId(scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-collapse-item>
              </el-collapse>
              <div style="margin: 3px;text-align: left">
                <el-button type="success" icon="el-icon-plus" :disabled="careHistory.id === undefined" @click="handleAddMedicinePrescription">添加药用处方</el-button>
                <el-button type="success" icon="el-icon-plus" :disabled="careHistory.id === undefined" @click="handleAddCheckPrescription">添加检查处方</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
      <!-- 右边接诊信息结束 -->
    </el-row>
    <!-- 底层卡片结束 -->

    <!-- 选择患者对话框开始 -->
    <el-dialog
      title="请选择挂号患者"
      :visible.sync="openRegistration"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <el-tabs v-model="activeName" :stretch="true" type="card" @tab-click="handleRegistrationTabClick">
        <el-tab-pane label="待就诊列表" name="t1">
          <el-table v-loading="tableLoading" border :data="toBeSeenRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleVisit(scope.row)">接诊</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊中列表" name="t2">
          <el-table v-loading="tableLoading" border :data="visitingRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="就诊完成列表" name="t3">
          <el-table v-loading="tableLoading" border :data="visitCompletedRegistration">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-form label-position="right" inline class="demo-table-expand">
                  <el-form-item label="挂号ID">
                    <span>{{ scope.row.id }}</span>
                  </el-form-item>
                  <el-form-item label="患者ID">
                    <span>{{ scope.row.patientId }}</span>
                  </el-form-item>
                  <el-form-item label="操作人">
                    <span>{{ scope.row.createBy }}</span>
                  </el-form-item>
                  <el-form-item label="挂号时间">
                    <span>{{ scope.row.createTime }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="患者姓名" align="center" prop="patientName" />
            <el-table-column label="挂号编号" align="center" prop="regNumber" />
            <el-table-column label="挂号类型" align="center" prop="schedulingType" :formatter="schedulingTypeFormatter" />
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="success" icon="el-icon-check" size="mini" @click="handleLoading(scope.row)">再次载入</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 选择患者对话框结束 -->

    <!-- 添加药用处方和检查处方对话框开始 -->
    <el-dialog
      :title="title"
      :visible.sync="openAddPrescriptionItem"
      width="1000px"
      center
      :close-on-click-modal="false"
      append-to-body
    >
      <div style="margin: 3px;text-align: right">
        【{{ submitPrescription.prescription.prescType === '0' ? '药用' : '检查' }}】
        处方总金额：￥ <span style="color: red">{{ submitPrescription.prescription.amount }}</span>
        <el-button style="margin-left: 15px" type="success" icon="el-icon-plus" :disabled="submitPrescription.prescriptionItemList.length === 0" @click="handleSavePrescriptionItem">确定添加</el-button>
      </div>
      <el-table border :data="submitPrescription.prescriptionItemList" :row-class-name="tableRowClassName">
        <el-table-column label="序号" align="center" type="index" width="50" />
        <el-table-column :label="submitPrescription.prescription.prescType === '0' ? '药用名称' : '项目名称'" align="center" prop="itemName" />
        <el-table-column label="数量" align="center" prop="num">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              size="small"
              @change="handlePrescriptionNumChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="单价（元）" align="center" prop="singlePrice" />
        <el-table-column label="金额（元）" align="center" prop="amount" />
        <el-table-column label="备注" align="center" prop="remark">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.remark"
              size="small"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" size="mini" @click="handleDeletePrescriptionItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="mini" style="width: 100%;margin-top: 2px" @click="handleOpenAddPrescriptionItemDrawer">
        添加【{{ submitPrescription.prescription.prescType === '0' ? '药用' : '检查' }}】项
      </el-button>
    </el-dialog>
    <!-- 添加药用处方和检查处方对话框结束 -->

    <!-- 药品列表抽屉开始 -->
    <el-drawer
      :visible.sync="openMedicinesDrawer"
      direction="rtl"
      append-to-body
    >
      <h2 align="center">药品列表</h2>
      <el-form ref="queryForm" :model="queryFormParams" label-width="68px">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryFormParams.keywords"
            placeholder="请输入关键字"
            clearable
            size="small"
            style="width: 180px"
          />
          <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleMedicinesQuery">查询</el-button>
          <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-table
          v-loading="drawerLoading"
          height="600px"
          border
          :data="tableList"
          @selection-change="handleMedicinesSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="药品ID" align="center" prop="id" />
          <el-table-column label="药品名称" align="center" prop="medicineName" />
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="库存量" align="center" prop="medicineStockNum" />
          <el-table-column label="单位" align="center">
            <template slot-scope="scope">
              {{ scope.row.conversion }}/ {{ scope.row.unit }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="total>0"
          :current-page="queryFormParams.pageNum"
          :page-sizes="[5,10,20,30]"
          :page-size="queryFormParams.pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
          @size-change="handleMedicineSizeChange"
          @current-change="handleMedicineCurrentChange"
        />
        <el-form-item>
          <div style="text-align: center">
            <el-button type="primary" round icon="el-icon-check" @click="handleAddPrescription" size="small">添加并关闭</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 药品列表抽屉结束 -->

    <!-- 检查项目抽屉开始 -->
    <el-drawer
      :visible.sync="openCheckItemDrawer"
      direction="rtl"
      append-to-body
    >
      <h2 align="center">检查项目列表</h2>
      <el-form ref="queryForm" :model="queryFormParams" label-width="68px">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            v-model="queryFormParams.keywords"
            placeholder="请输入关键字"
            clearable
            size="small"
            style="width: 180px"
          />
          <el-button type="primary" round icon="el-icon-search" size="mini" @click="handleCheckItemQuery">查询</el-button>
          <el-button type="primary" round icon="el-icon-refresh" size="mini" @click="handleReset">重置</el-button>
        </el-form-item>
        <el-table
          v-loading="drawerLoading"
          height="600px"
          border
          :data="tableList"
          @selection-change="handleCheckItemSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="项目ID" align="center" prop="id" />
          <el-table-column label="项目名称" align="center" prop="itemName" />
          <el-table-column label="关键字" align="center" prop="keywords" />
          <el-table-column label="项目单价" align="center" prop="unitPrice" />
          <el-table-column label="单位" align="center" prop="unit" />
        </el-table>
        <el-pagination
          v-show="total>0"
          :current-page="queryFormParams.pageNum"
          :page-sizes="[5,10,20,30]"
          :page-size="queryFormParams.pageSize"
          layout="total,sizes,prev,pager,next,jumper"
          :total="total"
          @size-change="handleCheckItemSizeChange"
          @current-change="handleCheckItemCurrentChange"
        />
        <el-form-item>
          <div style="text-align: center">
            <el-button type="primary" round icon="el-icon-check" @click="handleAddPrescription" size="small">添加并关闭</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 检查项目抽屉结束 -->
  </div>
</template>

<script>
import { queryToBeSeenRegistration, queryVisitingRegistration, queryVisitCompletedRegistration,
  receivePatient, getPatientAllMessageByPatientId, saveCareHistory, getCareHistoryByRegId, queryCareOrdersByChId,
  saveCareOrderItem, deleteCareOrderItemById, visitComplete } from '@/api/doctor/care'
import { listCheckItemForPage } from '@/api/system/checkItem'
import { listMedicinesForPage } from '@/api/erp/medicine'

export default {
  data() {
    return {
      // 遮罩层
      loading: false,
      // 对话框遮罩层
      tableLoading: false,
      // 选项卡默认值
      schedulingType: '1',
      // 挂号类型数据
      schedulingTypeOptions: [],
      // 接诊类型数据
      receiveTypeOptions: [],
      // 是否传染数据
      isContagiousOptions: [],
      // 处方详情状态数据
      prescriptionItemStatusOptions: [],
      // 性别数据
      sexOptions: [],
      // 左边患者数据
      patientAllObj: {
        patientObj: {},
        patientFileObj: {},
        careHistoryObjList: []
      },
      // 病历信息
      careHistory: {
        id: undefined,
        regId: undefined,
        receiveType: '0',
        isContagious: '0',
        caseDate: undefined,
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      },
      // 是否打开挂号患者列表对话框
      openRegistration: false,
      // 当前选中挂号列表选项卡
      activeName: 't1',
      // 右边选项卡
      careActiveName: 'c1',
      // 待就诊数据
      toBeSeenRegistration: [],
      // 就诊中数据
      visitingRegistration: [],
      // 就诊完成数据
      visitCompletedRegistration: [],
      // 发病日期
      caseDateObj: new Date(),
      // 处方以及处方详情数据
      prescriptionList: [],
      // 对话框标题
      title: '',
      // 是否打开添加药品或检查项对话框
      openAddPrescriptionItem: false,
      // 是否打开药品列表的抽屉
      openMedicinesDrawer: false,
      // 是否打开检查项的抽屉
      openCheckItemDrawer: false,
      // 抽屉遮罩层
      drawerLoading: false,
      // 药品或检查项抽屉的查询条件
      queryFormParams: {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      },
      // 药品或检查项表格数据
      tableList: [],
      // 抽屉总条数
      total: 0,
      // 抽屉里选中的数据
      selectItemList: [],
      // 处方以及处方详情
      submitPrescription: {
        prescription: {
          prescType: '0',
          amount: 0.00,
          patientId: undefined,
          patientName: undefined
        },
        prescriptionItemList: [
          {
            itemName: '111',
            num: 10,
            singlePrice: 10,
            amount: 100,
            remark: 'aaa'
          }
        ]
      }
    }
  },
  created() {
    // 加载排班类型
    this.getDictDataByType('his_scheduling_type').then(res => {
      this.schedulingTypeOptions = res.data
    })
    // 加载性别
    this.getDictDataByType('sys_user_sex').then(res => {
      this.sexOptions = res.data
    })
    // 加载接诊类型
    this.getDictDataByType('his_receive_type').then(res => {
      this.receiveTypeOptions = res.data
    })
    // 加载是否传染
    this.getDictDataByType('his_contagious_status').then(res => {
      this.isContagiousOptions = res.data
    })
    // 加载处方详情状态
    this.getDictDataByType('his_order_details_status').then(res => {
      this.prescriptionItemStatusOptions = res.data
    })
  },
  methods: {
    schedulingTypeChange(value) {
      this.schedulingType = value
    },
    // 挂号类型转换
    schedulingTypeFormatter(row) {
      return this.selectDictLabel(this.schedulingTypeOptions, row.schedulingType)
    },
    // 处方详情状态转换
    orderStatusFormatter(row) {
      return this.selectDictLabel(this.prescriptionItemStatusOptions, row.status)
    },
    // 打开挂号患者列表的弹出层
    viewRegistration() {
      this.activeName = 't1'
      this.openRegistration = true
      this.queryToBeSeenRegistration()
    },
    // 挂号列表对话框选项卡change事件
    handleRegistrationTabClick(tab, event) {
      if (tab.name === 't1') {
        this.queryToBeSeenRegistration()
      } else if (tab.name === 't2') {
        this.queryVisitingRegistration()
      } else if (tab.name === 't3') {
        this.queryVisitCompletedRegistration()
      }
    },
    // 查询待就诊的挂号列表数据
    queryToBeSeenRegistration() {
      this.tableLoading = true
      queryToBeSeenRegistration(this.schedulingType).then(res => {
        this.toBeSeenRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊中的挂号列表数据
    queryVisitingRegistration() {
      this.tableLoading = true
      queryVisitingRegistration(this.schedulingType).then(res => {
        this.visitingRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 查询就诊完成的挂号列表数据
    queryVisitCompletedRegistration() {
      this.tableLoading = true
      queryVisitCompletedRegistration(this.schedulingType).then(res => {
        this.visitCompletedRegistration = res.data
        this.tableLoading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.tableLoading = false
      })
    },
    // 接诊
    handleVisit(row) {
      this.careHistory.regId = row.id
      const patientId = row.patientId
      this.loading = true
      this.openRegistration = false
      receivePatient(this.careHistory.regId).then(res => {
        this.loading = false
        this.msgSuccess('接诊成功')
        // 根据患者ID查询患者信息、患者档案信息、病历信息
        getPatientAllMessageByPatientId(patientId).then(res => {
          this.patientAllObj.patientObj = res.data.patient
          this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
          this.patientAllObj.patientFileObj = res.data.patientFile
          this.patientAllObj.careHistoryObjList = res.data.careHistoryList
          this.loading = false
        }).catch(() => {
          this.msgError('查询患者信息失败')
          this.loading = false
        })
      }).catch(() => {
        this.msgError('接诊失败')
        this.loading = false
      })
    },
    // 载入
    handleLoading(row) {
      this.careHistory.regId = row.id
      const patientId = row.patientId
      this.openRegistration = false
      getPatientAllMessageByPatientId(patientId).then(res => {
        this.patientAllObj.patientObj = res.data.patient
        this.patientAllObj.patientObj.age = this.getAge(res.data.patient.birthday)
        this.patientAllObj.patientFileObj = res.data.patientFile
        this.patientAllObj.careHistoryObjList = res.data.careHistoryList
        this.loading = false
      }).catch(() => {
        this.msgError('载入失败')
        this.loading = false
      })
      // 根据挂号单ID查询病历信息
      this.getCareHistoryByRegId(row.id)
    },
    // 根据挂号单ID查询病历信息
    getCareHistoryByRegId(regId) {
      this.loading = true
      getCareHistoryByRegId(regId).then(res => {
        if (res.data != null) {
          this.careHistory = res.data
          this.caseDateObj = res.data.caseDate
          // 根据病历ID查询处方信息
          this.getCareOrdersByChId(res.data.id)
        } else {
          this.resetCareHistoryAndPrescription(regId)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.msgError('获取病历信息失败')
      })
    },
    // 根据病历ID查询处方信息
    getCareOrdersByChId(careHistoryId) {
      this.loading = true
      queryCareOrdersByChId(careHistoryId).then(res => {
        this.prescriptionList = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.msgError('获取处方信息失败')
      })
    },
    // 重置右边的病历以及处方信息
    resetCareHistoryAndPrescription(regId) {
      this.careHistory = {
        regId: regId,
        id: undefined,
        caseDate: undefined,
        receiveType: '0',
        isContagious: '0',
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      }
      this.caseDateObj = new Date()
      this.prescriptionList = []
    },
    // 保存病历信息
    handleSaveCareHistory() {
      if (!this.careHistory.regId) {
        this.msgError('请选择挂号患者')
        return
      }
      this.careHistory.caseDate = this.moment(this.caseDateObj).format('YYYY-MM-DD')
      this.careHistory.patientId = this.patientAllObj.patientObj.id
      this.careHistory.patientName = this.patientAllObj.patientObj.name
      this.loading = true
      saveCareHistory(this.careHistory).then(res => {
        this.loading = false
        this.msgSuccess('保存病历成功')
        this.careHistory.id = res.data.id
      }).catch(() => {
        this.loading = false
        this.msgError('保存病历失败')
      })
    },
    // 打开添加药用处方的对话框
    handleAddMedicinePrescription() {
      if (!this.careHistory.regId) {
        this.msgError('请选择挂号患者')
        return
      }
      if (!this.careHistory.id) {
        this.msgError('请先保存病历')
        return
      }
      this.submitPrescription.prescription.prescType = '0'
      this.title = '添加【药用】处方'
      this.openAddPrescriptionItem = true
      this.submitPrescription.prescriptionItemList = []
    },
    // 打开添加检查处方的对话框
    handleAddCheckPrescription() {
      if (!this.careHistory.regId) {
        this.msgError('请选择挂号患者')
        return
      }
      if (!this.careHistory.id) {
        this.msgError('请先保存病历')
        return
      }
      this.submitPrescription.prescription.prescType = '1'
      this.title = '添加【检查】处方'
      this.openAddPrescriptionItem = true
      this.submitPrescription.prescriptionItemList = []
    },
    // 打开药品或检查项的抽屉
    handleOpenAddPrescriptionItemDrawer() {
      if (this.submitPrescription.prescription.prescType === '0') {
        // 打开药品列表抽屉
        this.openMedicinesDrawer = true
        this.handleReset()
        this.getMedicinesList()
      } else {
        // 打开检查项抽屉
        this.openCheckItemDrawer = true
        this.handleReset()
        this.getCheckItemList()
      }
    },
    // 加载药品数据
    getMedicinesList() {
      this.tableList = []
      this.drawerLoading = true
      listMedicinesForPage(this.queryFormParams).then(res => {
        this.tableList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
        this.msgError('加载药品数据失败')
      })
    },
    // 药品抽屉数据表格多选择框选择时触发
    handleMedicinesSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 药品抽屉分页pageSize时触发
    handleMedicineSizeChange(val) {
      this.queryFormParams.pageSize = val
      this.getMedicinesList()
    },
    // 药品抽屉分页点击上一页 下一页时触发
    handleMedicineCurrentChange(val) {
      this.queryFormParams.pageNum = val
      this.getMedicinesList()
    },
    // 药品抽屉查询
    handleMedicinesQuery() {
      this.queryFormParams.pageNum = 1
      this.getMedicinesList()
    },
    // 加载检查项目数据
    getCheckItemList() {
      this.tableList = []
      this.drawerLoading = true
      listCheckItemForPage(this.queryFormParams).then(res => {
        this.tableList = res.data
        this.total = res.total
        this.drawerLoading = false
      }).catch(() => {
        this.drawerLoading = false
        this.msgError('加载检查项目数据失败')
      })
    },
    // 检查项抽屉数据表格多选择框选择时触发
    handleCheckItemSelectionChange(selection) {
      this.selectItemList = selection
    },
    // 检查项抽屉分页pageSize时触发
    handleCheckItemSizeChange(val) {
      this.queryFormParams.pageSize = val
      this.getCheckItemList()
    },
    // 检查项抽屉分页点击上一页 下一页时触发
    handleCheckItemCurrentChange(val) {
      this.queryFormParams.pageNum = val
      this.getCheckItemList()
    },
    // 检查项抽屉查询
    handleCheckItemQuery() {
      this.queryFormParams.pageNum = 1
      this.getCheckItemList()
    },
    // 重置
    handleReset() {
      this.queryFormParams = {
        pageNum: 1,
        pageSize: 10,
        keywords: undefined
      }
      if (this.submitPrescription.prescription.prescType === '0') {
        this.getMedicinesList()
      } else {
        this.getCheckItemList()
      }
    },
    // 药品或检查项抽屉添加数据
    handleAddPrescription() {
      const prescType = this.submitPrescription.prescription.prescType
      if (this.selectItemList.length === 0) {
        this.$message({
          message: '请选择【' + (prescType === '0' ? '药品' : '检查项') + '】数据',
          type: 'warning'
        })
        return
      }
      // 药品
      if (prescType === '0') {
        this.selectItemList.filter(item => {
          const obj = {
            itemId: item.id,
            itemName: item.medicineName,
            itemType: prescType,
            num: 1,
            singlePrice: item.medicinePrice,
            amount: 1 * item.medicinePrice,
            remark: '请按说明服用'
          }
          let flag = false // 默认没有选择
          this.submitPrescription.prescriptionItemList.filter(a => {
            if (a.itemId === obj.itemId) {
              a.num = a.num + 1
              flag = true
            }
          })
          if (!flag) {
            this.submitPrescription.prescriptionItemList.push(obj)
          }
          this.openMedicinesDrawer = false
        })
      } else {
        // 检查项目
        this.selectItemList.filter(item => {
          const obj = {
            itemId: item.id,
            itemName: item.itemName,
            itemType: prescType,
            num: 1,
            singlePrice: item.unitPrice,
            amount: 1 * item.unitPrice,
            remark: '请按要求检查'
          }
          let flag = false // 默认没有选择
          this.submitPrescription.prescriptionItemList.filter(a => {
            if (a.itemId === obj.itemId) {
              a.num = a.num + 1
              flag = true
            }
          })
          if (!flag) {
            this.submitPrescription.prescriptionItemList.push(obj)
          }
          this.openCheckItemDrawer = false
        })
      }
      // 计算总金额
      this.calculateAllAmount()
    },
    // 对话框中表格数据加上index
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },
    // 删除处方详情
    handleDeletePrescriptionItem(row) {
      this.submitPrescription.prescriptionItemList.splice(row.index, 1)
      this.calculateAllAmount()
    },
    // 计算处方详情总金额
    calculateAllAmount() {
      this.submitPrescription.prescription.amount = 0.00
      this.submitPrescription.prescriptionItemList.filter(item => {
        this.submitPrescription.prescription.amount += (item.num * item.singlePrice)
      })
    },
    // 监听药品或检查项弹出对话框中选中数量的变化
    handlePrescriptionNumChange(row) {
      row.amount = row.num * row.singlePrice
      this.calculateAllAmount()
    },
    // 保存处方相关信息
    handleSavePrescriptionItem() {
      if (this.submitPrescription.prescriptionItemList.length === 0) {
        this.$message({
          message: '请添加处方详情',
          type: 'warning'
        })
        return
      }
      this.submitPrescription.prescription.patientId = this.careHistory.patientId
      this.submitPrescription.prescription.patientName = this.careHistory.patientName
      this.submitPrescription.prescription.careHistoryId = this.careHistory.id
      console.log(this.submitPrescription)
      this.loading = true
      saveCareOrderItem(this.submitPrescription).then(res => {
        // 关闭当前弹出层
        this.openAddPrescriptionItem = false
        this.loading = false
        this.msgSuccess('保存成功')
        // 刷新处方列表
        this.getCareOrdersByChId(this.careHistory.id)
      }).catch(() => {
        this.msgError('保存失败')
        this.loading = false
      })
    },
    // 根据处方详情ID删除处方详情信息
    handleDeletePrescriptionItemByItemId(row) {
      const id = row.id
      const itemName = row.itemName
      const tx = this
      tx.$confirm('是否删除【' + itemName + '】这条处方详情', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteCareOrderItemById(id).then(res => {
          this.msgSuccess('删除成功')
          // 刷新处方列表
          this.getCareOrdersByChId(this.careHistory.id)
        }).catch(() => {
          this.msgError('删除失败')
        })
      })
    },
    // 完成就诊
    handleCompleteVisit() {
      const regId = this.careHistory.regId
      const patientName = this.careHistory.patientName
      const tx = this
      tx.$confirm('是否完成【' + patientName + '】的就诊', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        visitComplete(regId).then(res => {
          this.msgSuccess('操作成功')
          // 重置所有数据
          this.resetAllData()
        }).catch(() => {
          this.msgError('操作失败')
        })
      })
    },
    // 重置所有数据
    resetAllData() {
      this.patientAllObj = {
        patientObj: {},
        patientFileObj: {},
        careHistoryObjList: []
      }
      this.careHistory = {
        regId: undefined,
        id: undefined,
        caseDate: undefined,
        receiveType: '0',
        isContagious: '0',
        caseTitle: undefined,
        caseResult: undefined,
        doctorTips: undefined,
        remark: undefined,
        patientId: undefined,
        patientName: undefined
      }
      this.prescriptionList = []
      this.submitPrescription = {
        prescription: {
          amount: 0.00,
          patientId: undefined,
          patientName: undefined,
          prescType: '0'
        },
        prescriptionItemList: []
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
.item{
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
