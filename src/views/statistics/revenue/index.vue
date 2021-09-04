<template>
  <div v-loading="loading" class="app-container">
    <el-card style="margin-bottom: 10px">
      <div style="text-align: center;color: #dd1100">*注意默认只查询当天的统计数据，如果要查询其它的，请选择范围查询</div>
    </el-card>
    <el-card style="margin-bottom: 10px">
      <el-form ref="queryForm" :model="queryParams" label-width="68" :inline="true">
        <el-form-item label="选择时间">
          <el-date-picker
            v-model="dateRange"
            size="small"
            style="width:240px;margin-right: 10px"
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
    </el-card>
    <el-card>
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                合计收入
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.totalIncome" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                总收入
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.overview.totalAmount" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                总退款
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.overview.totalRefund" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                现金收入
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.channel.cashPayment" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-cash">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                支付宝收入
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.channel.aliPayment" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-alipay">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                现金退款
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.channel.cashRefund" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-payback">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                支付宝退款
              </div>
              <count-to :start-val="0.00" :end-val="revenueObj.channel.aliRefund" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart ref="p1" :prop-pie-data="revenueOverview" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart :prop-pie-data="incomeChanel" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart :prop-pie-data="refund" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import PieChart from './components/PieChart'
import { queryAllRevenueData } from '@/api/statistics/revenue'

export default {
  components: {
    CountTo,
    PieChart
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {},
      // 数据结构
      revenueObj: {
        totalIncome: 100.00, // 合计收入
        overview: {
          totalAmount: 50.00, // 总收入
          totalRefund: 10.00 // 总退款
        },
        channel: {
          cashPayment: 30.00, // 现金收入
          aliPayment: 40.00, // 支付宝收入
          cashRefund: 50.00, // 现金退款
          aliRefund: 20.00 // 支付宝退款
        }
      },
      // 图表数据
      revenueOverview: {
        title: '收支概况',
        data: [
          { value: 100, name: '总收入' },
          { value: 100, name: '总退款' }
        ]
      },
      incomeChanel: {
        title: '收入来源',
        data: [
          { value: 2, name: '现金收入' },
          { value: 2, name: '支付宝收入' }
        ]
      },
      refund: {
        title: '退款明细',
        data: [
          { value: 2, name: '现金退款' },
          { value: 2, name: '支付宝退款' }
        ]
      }
    }
  },
  created() {
    this.getRevenueData()
  },
  methods: {
    // 查询收支统计数据
    getRevenueData() {
      this.loading = true
      queryAllRevenueData(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.revenueObj = res.data.revenueObj
        this.revenueOverview = res.data.revenueOverview
        this.incomeChanel = res.data.incomeChanel
        this.refund = res.data.refund
        this.loading = false
      }).catch(() => {
        this.msgError('查询失败')
        this.loading = false
      })
    },
    // 查询
    handleQuery() {
      this.getRevenueData()
    },
    // 重置
    resetQuery() {
      this.resetForm('queryForm')
      this.dateRange = []
      this.getRevenueData()
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }

      .icon-cash {
        background: #9da408;
      }

      .icon-alipay {
        background: #F08047;
      }

      .icon-payback {
        background: #71ff68;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .icon-cash {
      color: #9da408;
    }

    .icon-alipay {
      color: #F08047;
    }

    .icon-payback {
      color: #71ff68;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
