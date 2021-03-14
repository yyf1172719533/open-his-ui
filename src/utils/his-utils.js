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

// 构造菜单树
export function handleTree(data, id, parentId, children, rootId) {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0

  // 对菜单数据进行深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  console.log(cloneData)
  // 循环所有数据
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    console.log(branchArr)
    // 返回上一层
    return father[parentId] === rootId
  })
  // console.log(treeData)
  return treeData !== '' ? treeData : data
}
