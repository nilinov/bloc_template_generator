import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Editor from '../views/Editor.vue'
import ModelEditor from '../views/ModelEditor/index.vue'
import ApiClient from "@/views/ApiClient/index.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Editor
  },
  {
    path: '/Model',
    name: 'Model',
    component: ModelEditor
  },
  {
    path: '/Model/Add',
    name: 'ModelAdd',
    component: ModelEditor
  },
  {
    path: '/Model/:uuid',
    name: 'ModelEdit',
    component: ModelEditor
  },
  {
    path: '/ApiClient',
    name: 'ApiClient',
    component: ApiClient
  }
]

const router = new VueRouter({
  routes
})

export default router
