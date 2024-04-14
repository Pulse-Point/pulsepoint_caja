import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'HomeView',
        component: Home
    },
    {
        path: '/servicios',
        name: 'ServiciosView',
        component: Home
    },
    {
        path: '/productos',
        name: 'ProductosView',
        component: () => import('../views/ProductosView.vue')
    },
    {
        path: '/clientela',
        name: 'ClientelaView',
        component: () => import('../views/ClientelaView.vue')
    },
    {
        path: '/contratos',
        name: 'ContratosView',
        component: () => import('../views/ContratosView.vue')
    },
    {
        path: '/inventario',
        name: 'InventarioView',
        component: () => import('../views/InventarioView.vue')
    },
    {
        path: '/reportes',
        name: 'ReportesView',
        component: () => import('../views/ReportesView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router