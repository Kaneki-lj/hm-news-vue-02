import Vue from 'vue'
import VueRouter from 'vue-router'

// 注册子组件
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import User from '../views/User.vue'
import Edit from '../views/Edit.vue'
import MyFollow from '../views/MyFollow.vue'
import MyComment from '../views/MyComment.vue'
import MyStar from '../views/MyStar.vue'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'
import TabsEdit from '../views/TabsEdit.vue'



Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/home'},
    { path: '/login', name: 'login', component: Login },
    { path: '/register', name: 'register',  component: Register },
    { path: '/user', component: User},
    { path: '/edit', component: Edit},
    { path: '/my-follow', component: MyFollow},
    { path: '/my-comment', component: MyComment},
    { path: '/my-star', component: MyStar},
    { path: '/home', component: Home},
    { path: '/detail/:id', component: Detail},
    { path: '/tabsedit', component: TabsEdit},
  ],
})

// 导航守卫 拦截未登录用户
router.beforeEach((to, from, next) => {
  const authPath = ['/user', '/my-follow', '/my-comment', '/my-star', '/edit']
  // if(to.path == '/user'){
  if(authPath.includes(to.path)){
    let token = localStorage.getItem('token')
    if(token) {
      next()
    }else{
      next('/login')
    }
  }else {
    next()
  }
})
export default router
