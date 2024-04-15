<template>
    <h1 class="view-title">Inventario</h1>

    <div class="action-menu">
        <select v-model="selectedOption" @change="handleOptionChange" style="width: 20%" class="form-select mb-3" aria-label="Large select example">
            <option disabled selected value="">Opciones de filtro</option>
            <option value="1">Precio &#x2191;</option>
            <option value="2">Precio &#x2193;</option>
            <option value="3">Nombre &#x2191;</option>
            <option value="4">Nombre &#x2193;</option>
        </select>

        <div style="width: 40%" class="input-group mb-3">
            <input v-model="searchText" @input="handleInputChange" type="text" class="form-control" placeholder="Escriba el nombre del producto a buscar...">
        </div>
    </div>
    <div class="table-section">
        <table class="content-table">
            <thead>
                <tr>
                    <th scope="col">Código</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Precio</th>
                    <th scope="col">Proveedor</th>
                    <th scope="col">Cant. Existente</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in filteredProducts" :key="product.productoCod">
                    <td>{{ product.productoCod }}</td>
                    <td>{{ product.tipoProductoNombre }}</td>
                    <td>{{ product.productoNombre }}</td>
                    <td>{{ product.productoPrecio }}</td>
                    <td>{{ product.productoProveedor }}</td>
                    <td>{{ product.productoExistencia }}</td>
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
                filteredProducts: [],
                productTypes: [],
                selectedOption: '',
                searchText: ''
            }
        },
        methods: {
            retrieveProducts() {                
                ipcRenderer.send('retrieve-products') // ask main process to retrieve products

                // listen for main process response
                ipcRenderer.once('products', (event, products) => {
                    console.log('products event received:', products)
                    
                    // map product type names to product
                    products.forEach(product => {
                        product.tipoProductoNombre = this.productTypes.find(pt => pt.id === product.tipoProductoId).tipoProducto
                    })

                    this.products = products
                    this.filteredProducts = products
                })
            },
            retrieveProductTypes() {
                ipcRenderer.send('retrieve-product-types') // ask main process to retrieve product types
                
                // listen for main process response
                ipcRenderer.once('product-types', (event, productTypes) => {
                    console.log('product-types event received:', productTypes)
                    this.productTypes = productTypes
                })
            },
            handleOptionChange() {
                if (this.selectedOption === '1') {
                    // Sort by price ascending
                    this.products.sort((a, b) => a.productoPrecio - b.productoPrecio);
                } else if (this.selectedOption === '2') {
                    // Sort by price descending
                    this.products.sort((a, b) => b.productoPrecio - a.productoPrecio);
                } else if (this.selectedOption === '3') {
                    // Sort by name ascending
                    this.products.sort((a, b) => a.productoNombre.localeCompare(b.productoNombre));
                } else if (this.selectedOption === '4') {
                    // Sort by name descending
                    this.products.sort((a, b) => b.productoNombre.localeCompare(a.productoNombre));
                }
            },
            handleInputChange() {
                // Filter products based on input text
                this.filteredProducts = this.products.filter(product => product.productoNombre.toLowerCase().includes(this.searchText.toLowerCase()));
            },
            handleButtonClick() {
                // Retrieve products again when button is clicked
                this.retrieveProducts();
            }
        },
        async created() {            
            this.retrieveProductTypes()
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