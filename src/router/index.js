import Vue from 'vue';
import VueRouter from 'vue-router';
import Editor from '../views/Editor.vue';
import ModelEditor from '../views/ModelEditor/index.vue';
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
        path: '/Model/:uuid',
        name: 'Model',
        component: ModelEditor
    },
    {
        path: '/about',
        name: 'About',
        // route level utils-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () { return import(/* webpackChunkName: "about" */ '../views/About.vue'); }
    }
];
var router = new VueRouter({
    routes: routes
});
export default router;
//# sourceMappingURL=index.js.map