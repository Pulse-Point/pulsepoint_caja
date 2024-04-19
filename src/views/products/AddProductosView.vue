<template>
    <button style="margin-top: 20px; width: 25%; margin-bottom: -4%; margin-right: 59%" class="btn btn-outline-primary"
        @click="$router.push(`/productos`)">Volver</button>
    <!-- Modal -->
    <transition name="fade">
        <div v-if="showModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; padding: 20px; margin: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); max-width: 500px;">
                <h2 style="font-size: 24px; color: #333; text-align: center;">Resultado</h2>
                <p style="font-size: 18px; color: #666; line-height: 1.6;">{{ modalMessage }}</p>        
                <button class="btn btn-primary" @click="$router.push('/productos')">Aceptar</button>
                <button class="btn btn-primary" @click="$router.push(`/productos/view/bill/${this.facturaCod}`)">Ver factura</button>
            </div>
        </div>
    </transition>
    <div class="form-container" style="gap: 50px">
        <div class="bill-details">            
            <div class="card shadow-sm rounded">
                <div class="card-body text-left">
                    <h1 class="card-title view-title">Detalles de la compra</h1>
                    <form @submit.prevent="submitForm">                
                        <div class="mb-3">
                            <label for="clienteDni" class="form-label">Cliente DNI:</label>
                            <input id="clienteDni" v-model="factura.clienteDni" type="text" class="form-control" required maxlength="11">
                        </div>                

                        <!-- payment methods -->
                        <div class="mb-3">
                            <label for="paymentMethod" class="form-label">Método de Pago:</label>
                            <select id="paymentMethod" v-model="factura.facturaMetodoPago" class="form-control" required>
                                <option value="">Seleccione un método de pago...</option>
                                <option value="efectivo">Efectivo</option>
                                <option value="tarjeta">Tarjeta</option>
                                <option value="transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="facturaDescripcion" class="form-label">Descripcion:</label>
                            <input id="facturaDescripcion" v-model="factura.facturaDescripcion" type="text" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label for="facturaDescripcion" class="form-label">Detalle:</label>
                            <input id="facturaDescripcion" v-model="factura.facturaDetalle" type="text" class="form-control" required>
                        </div>

                        <div class="totals" style="margin-bottom: 15px">
                            <h3><strong>Subtotal:</strong> RD$ {{ salesTotal }}</h3>
                            <h3><strong>ITBIS:</strong> RD$ {{ salesTotal * 0.18}}</h3>
                            <h3><strong>Total:</strong> RD$ {{ salesTotal + (salesTotal * 0.18)}}</h3>
                        </div>

                        <button style="width:100%" type="submit" class="btn btn-primary" :disabled="isSubmitting">
                            <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Procesar factura
                        </button>
                    </form>
                </div>
            </div> 
        </div>
        <div class="sale-containers">
            <transition-group name="fade" tag="div" class="sale-containers">
                <div v-for="(sale, index) in sales" :key="index">
                    <div class="card shadow-sm rounded" style="margin-bottom: 25px">
                        <div class="card-body text-left">
                            <div class="mb-3">
                            <label for="product" class="form-label">Producto:</label>
                            <transition name="fade">
                                <v-select 
                                id="product" 
                                v-model="sale.product" 
                                :options="products" 
                                label="productoNombre" 
                                required 
                                @option:selected="product => onProductSelected(product, sale)"
                                placeholder="Seleccione un producto...">
                                <template #no-options>
                                    No se han encontrado productos...
                                </template>
                                </v-select>
                            </transition>
                            </div>
                            <div class="mb-3">
                                <label for="quantity" class="form-label">Cantidad:</label>
                                <input id="quantity" v-model.number="sale.quantity" @change="() => updateSalePrice(sale)" class="form-control" required>
                            </div>
                            <p style="font-size: 18px; color: #666; line-height: 1.6;">Subtotal: RD$ {{ sale.subtotal }}</p>
                            <button class="btn btn-danger" @click="removeSale(index)">Eliminar</button>
                        </div>
                    </div>
                </div>
            </transition-group>
            <button class="btn btn-primary" @click="addSale" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Agregar Producto
            </button>
        </div>
    </div>   
    &nbsp;
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'
    import vSelect from 'vue-select'
    import "vue-select/dist/vue-select.css";

    export default {
        data() {
            return {
                products: [],
                isSubmitting: false,
                productTypes: [],
                facturaCod: '',
                factura: {
                    clienteDni: '',
                    facturaDetalle: '',
                    facturaDescripcion: '',
                    facturaSubtotal: '',
                    facturaMetodoPago: '',
                },          
                sales: [
                ],
                showModal: false,
            }
        },
        components: {
            'v-select': vSelect
        },
        computed: {
            salesTotal() {
                console.log('current sales:', this.sales)
                return this.sales.reduce((total, sale) => total + sale.subtotal, 0);
            },            
        },
        methods: {
            retrieveProductTypes() {
                ipcRenderer.send('retrieve-product-types') // ask main process to retrieve product types

                // listen for main process response
                ipcRenderer.once('product-types', (event, productTypes) => {
                    console.log('product-types event received:', productTypes)
                    this.productTypes = productTypes
                })
            },
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
                })
            },
            addSale() {
                this.sales.push({ product: '', quantity: 1, subtotal: 0});
            },
            removeSale(index) {
                this.sales.splice(index, 1);
            },
            onProductSelected(selectedProduct, sale) {
                sale.price = selectedProduct.productoPrecio;
                sale.productoCod = selectedProduct.productoCod;
                sale.productoId = selectedProduct.id;
                this.updateSalePrice(sale);
            },
            updateSalePrice(sale) {
                sale.subtotal = sale.quantity * sale.price;
            },
            submitForm() {
                this.isSubmitting = true;

                const mainBill = {
                    clienteDni: this.factura.clienteDni,
                    facturaDetalle: this.factura.facturaDetalle,
                    facturaDescripcion: this.factura.facturaDescripcion,
                    facturaMetodoPago: this.factura.facturaMetodoPago,
                    facturaTotal: this.salesTotal,
                }

                const salesToSend = this.sales.map(sale => ({
                    productoId: sale.productoId,
                    productoCod: sale.productoCod,
                    productoCantidad: sale.quantity,
                    subtotal: sale.subtotal,
                    itbis: sale.subtotal * 0.18,
                    total: sale.subtotal + (sale.subtotal * 0.18),
                }));
                console.log('mainBill:', mainBill)
                console.log('salesToSend:', salesToSend)

                ipcRenderer.send('create-sale-bill', mainBill, salesToSend)
                
                ipcRenderer.once('sale-bill-created', (event, facturaCod) => {
                    console.log('facturaCod:', facturaCod)
                    this.facturaCod = facturaCod;
                    console.log('sale-bill-created event received!')
                    const message = 'Factura procesada exitosamente!'
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = message;                  
                })
            }
        },
        async created() {     
            this.retrieveProductTypes()       
            this.retrieveProducts()
            this.addSale()
        },
        setup() {
            return { collapsed, toggleSidebar }
        }
    }
</script>

<style scoped>
    .form-container {
        padding: 75px;
        gap: 25px;
        display: flex;
    }

    .sale-containers {
        width: 50%;
        text-align: left;
    }

    .bill-details {
        width: 50%;
        text-align: left;
        height: 100%;
    }

    .view-title {
        font-size: 2em;
        text-align: left;
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

    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s;
    }
    
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>