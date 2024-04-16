import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'HomeView',
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
        component: () => import('../views/clients/ClientelaView.vue')
    },
    {
        path: '/clientela/add',
        name: 'AddClientView',
        component: () => import('../views/clients/AddClientView.vue')
    },
    {
        path: '/clientela/edit/:dni',
        name: 'EditClienteView',
        component: () => import('../views/clients/UpdateClientView.vue')
    },
    {
        path: '/contratos',
        name: 'ContratosView',
        component: () => import('../views/contracts/ContratosView.vue')
    },
    {
        path: '/contratos/add',
        name: 'AddContract',
        component: () => import('../views/contracts/AddContract.vue')
    },
    {
        path: '/contratos/view/:dni',
        name: 'ViewContract',
        component: () => import('../views/contracts/ViewContract.vue')
    },
    {
        path: '/contratos/edit/:dni',
        name: 'EditContract',
        component: () => import('../views/contracts/EditContract.vue')
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