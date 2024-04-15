<template>
    <h1 class="view-title">Inventario</h1>

    <div class="action-menu">
        <button type="button" class="btn btn-primary">Añadir Nuevo Producto</button>
        
        <select style="width: 20%" class="form-select mb-3" aria-label="Large select example">
            <option selected>Opciones de filtro</option>
            <option value="1">Ascendente</option>
            <option value="2">Descendente</option>
            <option value="3">Precio</option>
        </select>

        <div style="width: 40%" class="input-group mb-3">
            <input type="text" class="form-control" placeholder="Escriba el nombre del producto a buscar..." aria-label="Example text with button addon" aria-describedby="button-addon1">
            <button class="btn btn-outline-primary" type="button" id="button-addon1">Buscar</button>
        </div>
    </div>

    <table class="table inventory-table">
        <thead class="table-header">
            <th>Código</th>
            <th>Tipo</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Proveedor</th>
            <th>Cant. Existente</th>
            <th>Acciones</th>
        </thead>
        <tbody>
            <tr v-for="product in products" :key="product.productoCod">
                <td>{{ product.productoCod }}</td>
                <td>{{ product.tipoProductoId }}</td>
                <td>{{ product.productoNombre }}</td>
                <td>{{ product.productoPrecio }}</td>
                <td>{{ product.productoProveedor }}</td>
                <td>{{ product.productoExistencia }}</td>
                <td><!-- Acciones --></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'

    export default {
        data() {
            return {
                products: []
            }
        },
        methods: {
            retrieveProducts() {                
                ipcRenderer.send('retrieve-products') // ask main process to retrieve products

                // listen for main process response
                ipcRenderer.once('products', (event, products) => {
                    console.log('products event received:', products)
                    this.products = products
                })
            }
        },
        async created() {
            // retrieve products from main process   
            this.retrieveProducts()
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