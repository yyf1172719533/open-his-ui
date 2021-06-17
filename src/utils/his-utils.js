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
  // 循环所有数据
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回上一层
    return father[parentId] === rootId
  })
  // console.log(treeData)
  return treeData !== '' ? treeData : data
}

// 根据出生年月日计算年龄
export function getAge(birthday) {
  var birArr = birthday.split('-')
  var birYear = parseInt(birArr[0])
  var birMonth = parseInt(birArr[1])
  var birDay = parseInt(birArr[2])
  d = new Date()
  var nowYear = d.getFullYear()
  var nowMonth = d.getMonth() + 1
  var nowDay = d.getDate()
  var returnAge

  if (birArr == null) {
    return false
  }
  var d = new Date(birYear, birMonth - 1, birDay)

  if (d.getFullYear() === birYear && (d.getMonth() + 1) === birMonth && d.getDate() === birDay) {
    if (nowYear === birYear) {
      returnAge = 0
    } else {
      var ageDiff = nowYear - birYear
      if (ageDiff > 0) {
        if (nowMonth === birMonth) {
          var dayDiff = nowDay - birDay
          if (dayDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        } else {
          var monthDiff = nowMonth - birMonth
          if (monthDiff < 0) {
            returnAge = ageDiff - 1
          } else {
            returnAge = ageDiff
          }
        }
      } else {
        return '出生日期晚于今天，数据有误'
      }
    }
    return returnAge
  } else {
    return '输入的日期格式有误'
  }
}

// 判断当前时间
export function getCurrentTimeType() {
  const now = new Date()
  const hour = now.getHours()
  if (hour >= 6 && hour < 12) {
    return '1'
  } else if (hour >= 12 && hour < 18) {
    return '2'
  } else {
    return '3'
  }
}
