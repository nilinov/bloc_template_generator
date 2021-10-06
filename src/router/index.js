import Vue from 'vue';
import VueRouter from 'vue-router';
import Editor from '../views/Editor.vue';
import Project from '../views/Project/index.vue';
import ModelEditor from '../views/ModelEditor/index.vue';
import ApiClient from "@/views/ApiClient/index.vue";
import MockEditor from "@/views/Mock/index.vue";
Vue.use(VueRouter);
var routes = [
    {
        path: '/State',
        name: 'Home',
        component: Editor
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
    }
];
var router = new VueRouter({
    routes: routes
});
export default router;
//# sourceMappingURL=index.js.map