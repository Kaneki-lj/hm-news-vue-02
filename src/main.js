import Vue from 'vue'
import App from './App.vue'
//引入路由
import router from './router'

// 引入公共样式css
import './styles/base.less'
// 引入字体图标
import './styles/iconfont.css'

// 引入rem适配
import 'lib-flexible'

// 引入子组件
import HmHeader from './components/HmHeader.vue'
import HmLogo from './components/HmLogo.vue'
import HmButton from './components/HmButton.vue'
import HmPost from './components/HmPost.vue'

// 全局注册子组件
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-post', HmPost)

// 引入vant
import {
  Field,
  Toast,
  Cell,
  CellGroup,
  Dialog,
  Radio,
  RadioGroup,
  Uploader,
  List,
  Tab,
  Tabs,
  PullRefresh,
} from 'vant'

Vue.use(PullRefresh)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(List)
Vue.use(Uploader)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Dialog)

// 引入axios
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://localhost:3000'

// 请求拦截器
axios.interceptors.request.use(config => {
  let token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

/* {
  headers: {
    Authorization: token,
  },
} */

// 引入moment
import moment from 'moment'
Vue.filter('date', function(val, format = 'YYYY-MM-DD') {
  return moment(val).format(format)
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
