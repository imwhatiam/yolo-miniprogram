Page({
  data: {
    tasks: [] // 任务数据将在 onLoad 中初始化
  },

  onLoad: function() {
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
        completed: false,      // 新增：主任务复选框状态
        newSubTaskTitle: "",   // 新增：用于输入新增子任务名称
        progress: 0,
        subTasks: subTasks
      });
    }
    this.setData({ tasks });
  },
  
  // 切换任务展开/收起状态
  toggleExpand: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.expanded = !task.expanded;
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 根据子任务完成情况计算任务进度
  updateTaskProgress: function(task) {
    let total = task.subTasks.length;
    let completedCount = task.subTasks.filter(sub => sub.completed).length;
    let progress = total ? Math.round((completedCount / total) * 100) : 0;
    return progress;
  },

  // 切换子任务完成状态
  toggleSubTask: function(e) {
    const taskId = e.currentTarget.dataset.taskId;
    const subTaskId = e.currentTarget.dataset.subid;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.subTasks = task.subTasks.map(sub => {
          if (sub.id === subTaskId) {
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

  toggleMainTask: function(e) {
    const taskId = e.currentTarget.dataset.id;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        // 单个复选框返回数组，非空表示选中
        task.completed = e.detail.value.length > 0;
        // 同步更新所有子任务的完成状态
        task.subTasks = task.subTasks.map(sub => {
          sub.completed = task.completed;
          return sub;
        });
        task.progress = task.completed ? 100 : this.updateTaskProgress(task);
      }
      return task;
    });
    this.setData({ tasks });
  },
  updateNewSubTaskInput: function(e) {
    const taskId = e.currentTarget.dataset.id;
    const value = e.detail.value;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.newSubTaskTitle = value;
      }
      return task;
    });
    this.setData({ tasks });
  },
  addSubTask: function(e) {
    const taskId = e.currentTarget.dataset.id;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        if (task.newSubTaskTitle.trim() !== "") {
          let newSubTask = {
            id: task.id * 100 + task.subTasks.length + 1, // 简单生成唯一 ID
            title: task.newSubTaskTitle,
            completed: false,
            isDeleted: false
          };
          task.subTasks.push(newSubTask);
          task.newSubTaskTitle = "";
          task.progress = this.updateTaskProgress(task);
        } else {
          wx.showToast({
            title: '请输入子任务名称',
            icon: 'none'
          });
        }
      }
      return task;
    });
    this.setData({ tasks });
  },
    
  // 标记主要任务为删除状态
  markTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.isDeleted = true;
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 确认删除主要任务（彻底删除）
  confirmTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    let tasks = this.data.tasks.filter(task => task.id !== taskId);
    this.setData({ tasks });
  },

  // 取消主要任务删除状态
  cancelTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.id;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.isDeleted = false;
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 标记子任务为删除状态
  markSubTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.taskId;
    const subTaskId = e.currentTarget.dataset.subid;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.subTasks = task.subTasks.map(sub => {
          if (sub.id === subTaskId) {
            sub.isDeleted = true;
          }
          return sub;
        });
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 确认删除子任务（彻底删除）
  confirmSubTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.taskId;
    const subTaskId = e.currentTarget.dataset.subid;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.subTasks = task.subTasks.filter(sub => sub.id !== subTaskId);
        task.progress = this.updateTaskProgress(task);
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 取消子任务删除状态
  cancelSubTaskDelete: function(e) {
    const taskId = e.currentTarget.dataset.taskId;
    const subTaskId = e.currentTarget.dataset.subid;
    let tasks = this.data.tasks.map(task => {
      if (task.id === taskId) {
        task.subTasks = task.subTasks.map(sub => {
          if (sub.id === subTaskId) {
            sub.isDeleted = false;
          }
          return sub;
        });
      }
      return task;
    });
    this.setData({ tasks });
  },

  // 跳转到添加任务页面
  goToAddTask: function() {
    wx.navigateTo({
      url: '/pages/addTask/addTask'
    });
  }
})
