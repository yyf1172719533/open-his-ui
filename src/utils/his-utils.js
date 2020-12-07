// 条件查询重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 日期范围
export function addDateRange(params, dateRange) {
  const search = params
  search.startTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '' && dateRange !== undefined) {
    search.startTime = dateRange[0]
    search.endTime = dateRange[1]
  }
  return search
}

// 状态转换
export function selectDictLabel(datas, value) {
  const actions = []
  Object.keys(datas).map((key) => {
    if (datas[key].dictValue === value) {
      actions.push(datas[key].dictLabel)
      return false
    }
  })
  return actions.join('')
}
