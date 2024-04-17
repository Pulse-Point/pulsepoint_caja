<template>
    <h1 class="view-title">Ventas de Productos/Servicios</h1>

    <div class="action-menu">
        <button class="btn btn-primary" style="width: 30%;" @click="$router.push('/productos/add')">Facturar Productos</button>

        <div style="width: 40%" class="input-group mb-3">
            <input v-model="searchText" @input="handleInputChange" type="text" class="form-control" placeholder="Buscar ventas...">
        </div>
    </div>
    <div class="table-section">
        <table class="content-table">
            <thead>
                <tr>
                    <th scope="col">Código</th>
                    <th scope="col">DNI</th>
                    <th scope="col">Detalle</th>
                    <th scope="col">Descripción</th>
                    <th scope="col">Total</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="factura in filteredFacturas" :key="factura.facturaCod">
                    <td>{{ factura.facturaCod }}</td>
                    <td>{{ factura.clienteDni }}</td>
                    <td>{{ factura.facturaDetalle }}</td>
                    <td>{{ factura.facturaDescripcion }}</td>
                    <td>{{ factura.facturaTotal }}</td>
                    <td style="display: flex; align-items: center; justify-content: space-evenly;">
                        <button class="btn btn-outline-primary" @click="$router.push(`/productos/view/bill/${factura.facturaCod}`)">Ver</button>
                        <button class="btn btn-outline-danger" @click="deleteBillSales(factura.facturaCod)">Eliminar</button>
                    </td>
                </tr>
            </tbody>
        </table>
        &nbsp;
    </div>
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'

    export default {
        data() {
            return {
                products: [],
                productTypes: [],
                facturas: [],
                filteredFacturas: [],
                selectedOption: '',
                searchText: ''
            }
        },
        methods: {            
            retrieveFacturas() {
                ipcRenderer.send('retrieve-facturas') // ask main process to retrieve facturas

                // listen for main process response
                ipcRenderer.once('facturas', (event, facturas) => {
                    console.log('facturas event received:', facturas)
                    this.facturas = facturas
                    this.filteredFacturas = facturas
                })
            },
            handleInputChange() {
                // Filter clients based on input text
                this.filteredFacturas = this.facturas.filter(factura => {
                    return factura.clienteDni.toLowerCase().includes(this.searchText.toLowerCase()) 
                })
            },
            deleteBillSales(facturaCod) {
                // ask if user is sure to delete bill and sales
                if (confirm('¿Está seguro que desea eliminar esta factura y sus ventas?')) {                
                    ipcRenderer.send('delete-bill-and-sales', facturaCod)
                    ipcRenderer.once('bill-and-sales-deleted', (event, deleted) => {
                        console.log('bill and sales deleted event received:', deleted)
                        this.retrieveFacturas()
                    })
                }
            }
        },
        async created() {            
            this.retrieveFacturas()
        },
        setup() {
            return { collapsed, toggleSidebar }
        }
    }
</script>

<style scoped>
    .view-title {
        font-size: 2em;
        text-align: left;
        padding-left: 25px;
        padding-top: 25px;
        font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: black;
    }

    .action-menu {
        padding: 25px;
        gap: 25px;
        display: flex;
        align-items: flex-start;
    }

    .btn-outline-primary:hover {
        background-color: #fe3030;
        border-color: #fe3030;
        color: #fff;        
    }

    .btn-primary:hover {
        background-color: #fe3030;
        border-color: #fe3030;
        color: #fff;        
    }
</style>