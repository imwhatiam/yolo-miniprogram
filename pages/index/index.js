Page({
  data: {
    tasks: []
  },

  onLoad: function() {
    // 初始化任务数据
    let tasks = [];
    for (let i = 1; i <= 8; i++) {
      let subTasks = [];
      let subTaskCount = 3; // 可调整为3-5个子任务
      for (let j = 1; j <= subTaskCount; j++) {
        subTasks.push({
          id: i * 100 + j,
          title: `子任务${j}`,
          completed: false,
          isDeleted: false
        });
      }
      tasks.push({
        id: i,
        title: `任务${i}`,
        expanded: false,
        isDeleted: false,
        completed: false,
        newSubTaskTitle: "",
        progress: 0,
        subTasks: subTasks
      });
    }
    this.setData({ tasks });
  },

  // 切换任务展开状态
  toggleExpand: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const tasks = this.data.tasks.map(task => {
      if (task.id == taskId) {
        task.expanded = !task.expanded;
        // 收起时清空输入框
        if (!task.expanded) task.newSubTaskTitle = "";
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 更新任务进度
  updateTaskProgress: function(task) {
    const validTasks = task.subTasks.filter(sub => !sub.isDeleted);
    const completedCount = validTasks.filter(sub => sub.completed).length;
    return validTasks.length ? Math.round((completedCount / validTasks.length) * 100) : 0;
  },

  // 切换子任务状态
  toggleSubTask: function(e) {
    const { taskId, subid } = e.currentTarget.dataset;
    const tasks = this.data.tasks.map(task => {
      if (task.id == taskId) {
        task.subTasks = task.subTasks.map(sub => {
          if (sub.id == subid) {
            sub.completed = !sub.completed;
          }
          return sub;
        });
        task.progress = this.updateTaskProgress(task);
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 切换主任务状态
  toggleMainTask: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const isChecked = e.detail.value.length > 0;
    
    const tasks = this.data.tasks.map(task => {
      if (task.id == taskId) {
        task.completed = isChecked;
        // 同步子任务状态（仅更新未删除的子任务）
        task.subTasks = task.subTasks.map(sub => {
          if (!sub.isDeleted) sub.completed = isChecked;
          return sub;
        });
        task.progress = isChecked ? 100 : this.updateTaskProgress(task);
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 处理子任务输入
  updateNewSubTaskInput: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const value = e.detail.value;
    this.setData({
      tasks: this.data.tasks.map(task => {
        if (task.id == taskId) task.newSubTaskTitle = value;
        return task;
      })
    });
  },

  // 添加子任务
  addSubTask: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const tasks = this.data.tasks.map(task => {
      if (task.id == taskId) {
        const title = task.newSubTaskTitle.trim();
        if (title) {
          task.subTasks.push({
            id: Date.now(), // 使用时间戳保证唯一性
            title: title,
            completed: false,
            isDeleted: false
          });
          task.newSubTaskTitle = "";
          task.progress = this.updateTaskProgress(task);
        } else {
          wx.showToast({ title: '请输入子任务名称', icon: 'none' });
        }
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 任务删除相关操作
  markTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    this.updateTaskStatus(taskId, 'isDeleted', true);
  },

  confirmTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    this.setData({
      tasks: this.data.tasks.filter(task => task.id != taskId)
    });
  },

  cancelTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    this.updateTaskStatus(taskId, 'isDeleted', false);
  },

  // 子任务删除相关操作
  markSubTaskDelete: function(e) {
    const { taskId, subid } = e.currentTarget.dataset;
    this.updateSubTaskStatus(taskId, subid, 'isDeleted', true);
  },

  confirmSubTaskDelete: function(e) {
    const { taskId, subid } = e.currentTarget.dataset;
    this.setData({
      tasks: this.data.tasks.map(task => {
        if (task.id == taskId) {
          task.subTasks = task.subTasks.filter(sub => sub.id != subid);
          task.progress = this.updateTaskProgress(task);
        }
        return task;
      })
    });
  },

  cancelSubTaskDelete: function(e) {
    const { taskId, subid } = e.currentTarget.dataset;
    this.updateSubTaskStatus(taskId, subid, 'isDeleted', false);
  },

  // 通用状态更新方法
  updateTaskStatus: function(taskId, key, value) {
    this.setData({
      tasks: this.data.tasks.map(task => {
        if (task.id == taskId) task[key] = value;
        return task;
      })
    });
  },

  updateSubTaskStatus: function(taskId, subId, key, value) {
    this.setData({
      tasks: this.data.tasks.map(task => {
        if (task.id == taskId) {
          task.subTasks = task.subTasks.map(sub => {
            if (sub.id == subId) sub[key] = value;
            return sub;
          });
        }
        return task;
      })
    });
  },

  // 跳转添加任务页面
  goToAddTask: function() {
    wx.navigateTo({
      url: '/pages/addTask/addTask'
    });
  }
})