import * as echarts from '../../ec-canvas/echarts';

Page({
  data: {
    ec: {
      onInit: initChart
    },
    industry: ''
  },

  onLoad(options) {
    const industry = decodeURIComponent(options.industry);
    this.setData({ industry });
    this.fetchChartData(industry);
  },

  fetchChartData(industry) {
    const self = this;
    wx.request({
      url: 'https://www.lian-yolo.com/stock/api/trading-crowding/',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: {
        industry_list: [industry]
      },
      success(res) {
        if (res.statusCode === 200) {
          const data = res.data.data || res.data;
          // 获取所有日期并排序
          const dates = Object.keys(data).sort();
          // 计算比值：行业数值 / total_money
          const ratioData = dates.map(date => {
            const dayData = data[date];
            const total = dayData.total_money;
            const industryValue = dayData[industry];
            return industryValue / total;
          });
          self.initChartOption(dates, ratioData);
        } else {
          const errMsg = res.data.error || '加载数据失败';
          wx.showToast({
            title: errMsg,
            icon: 'none'
          });
        }
      }
    });
  },

  initChartOption(dates, ratioData) {
    if (this.chart) {
      const option = {
        xAxis: {
          type: 'category',
          data: dates
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: function(value) {
              return (value * 100).toFixed(2) + '%';
            }
          }
        },
        series: [{
          data: ratioData,
          type: 'line',
          smooth: true
        }]
      };
      this.chart.setOption(option);
    }
  },

  onReady() {
    // 图表实例在 initChart 中已保存到 this.chart
  }
});

// 初始化 echarts 图表
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr
  });
  canvas.setChart(chart);
  // 保存图表实例到当前页面对象
  const page = getCurrentPages().pop();
  page.chart = chart;
  return chart;
}
