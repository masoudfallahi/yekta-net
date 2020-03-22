import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import ChangesReport from './pages/ChangesReport.vue';

Vue.use(VueRouter);

Vue.config.productionTip = false;
const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: ChangesReport,
            meta: {
                requiresAuth: false,
                title: 'تغییرات آگهی',
            },
        },
    ],
});
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
