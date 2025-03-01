Page({
  data: {
    taskTitle: ''
  },

  // 输入框事件，更新任务名称
  onInputChange: function(e) {
    this.setData({
      taskTitle: e.detail.value
    });
  },

  // 保存任务（示例中仅做提示并返回首页）
  saveTask: function() {
    if (this.data.taskTitle) {
      wx.showToast({
        title: '任务已添加',
        icon: 'success'
      });
      // 这里可以将新任务传递给首页或存入全局数据
      wx.navigateBack();
    } else {
      wx.showToast({
        title: '请输入任务名称',
        icon: 'none'
      });
    }
  }
})
