import Vue from 'vue';
import VueRouter from 'vue-router';
import Editor from '../views/Editor.vue';
import ModelEditor from '../views/ModelEditor/index.vue';
import ApiClient from "@/views/ApiClient/index.vue";
Vue.use(VueRouter);
var routes = [
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
];
var router = new VueRouter({
    routes: routes
});
export default router;
//# sourceMappingURL=index.js.map