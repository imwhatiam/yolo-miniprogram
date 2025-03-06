// config.js
const API_BASE = 'https://www.lian-yolo.com/weixin-miniprogram/api';
export const API = {
  checkList: (id) => `${API_BASE}/check-list/?id=${id}`,
};
