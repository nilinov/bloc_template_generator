import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import StateEditor from '../views/StateEditor/index.vue'
import Project from '../views/Project/index.vue'
import ModelEditor from '../views/ModelEditor/index.vue'
import ApiClient from "@/views/ApiClient/index.vue";
import MockEditor from "@/views/Mock/index.vue";
import Proxy from "@/views/Proxy/index.vue";
import Admin from "@/views/Admin/index.vue";
import ApiExport from "@/views/Export/index.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/State',
    name: 'Home',
    component: StateEditor
  },
  {
    alias: "/",
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
  },
  {
    path: '/ApiExport',
    name: 'ApiExport',
    component: ApiExport
  },
  {
    path: '/MockEditor',
    name: 'MockEditor',
    component: MockEditor
  },
  {
    path: '/MockEditor/:uuid',
    name: 'MockEditor',
    component: MockEditor
  },
  {
    path: '/Project',
    name: 'Project',
    component: Project
  },
  {
    path: '/Admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/Proxy',
    name: 'Proxy',
    component: Proxy
  }
]

const router = new VueRouter({
  routes
})

export default router
