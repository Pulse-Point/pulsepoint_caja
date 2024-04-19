<template>
    <button style="margin-top: 10px; width: 25%; margin-bottom: -8%;" class="btn btn-outline-primary"
        @click="$router.push('/contratos')">Volver</button>
    <!-- Modal -->
    <transition name="fade">
        <div v-if="showModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; padding: 20px; margin: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); max-width: 500px;">
                <h2 style="font-size: 24px; color: #333; text-align: center;">Resultado</h2>
                <p style="font-size: 18px; color: #666; line-height: 1.6;">{{ modalMessage }}</p>        
                <button class="btn btn-primary" @click="$router.push('/contratos')">Aceptar</button>
                <button class="btn btn-primary" @click="$router.push(`/contratos/view/bill/${this.dni}`)">Ver factura</button>
            </div>
        </div>
    </transition>
    <center>
    <div class="card shadow-sm rounded" style="width: 50%">
        <div class="card-body text-left">
            <h1 class="card-title view-title">Registrar un nuevo Contrato</h1>
            <form @submit.prevent="submitForm">                
                <div class="mb-3">
                    <label for="clienteDni" class="form-label">Cliente DNI:</label>
                    <input id="clienteDni" v-model="contract.clienteDni" type="text" class="form-control" required maxlength="11">
                </div>

                <div class="mb-3">
                    <label for="servicioCod" class="form-label">Servicio:</label>
                    <transition name="fade">
                        <v-select 
                        id="servicioCod" 
                        v-model="selectedService" 
                        :options="services" 
                        label="servicioNombre" required 
                        @option:selected="onServiceSelected" 
                        placeholder="Seleccione un servicio">
                            <template #no-options>
                                No se han encontrado servicios...
                            </template>
                        </v-select>
                    </transition>
                </div>

                <div class="mb-3">
                    <label for="contratoDescripcion" class="form-label">Descripcion:</label>
                    <input id="contratoDescripcion" v-model="contract.contratoDescripcion" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="contratoFechaInicio" class="form-label">Fecha de Inicio:</label>
                    <input id="contratoFechaInicio" v-model="contract.contratoFechaInicio" type="date" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="contratoFechaVencimiento" class="form-label">Fecha de Vencimiento:</label>
                    <input id="contratoFechaVencimiento" v-model="contract.contratoFechaVencimiento" type="date" class="form-control" required>
                </div>

                <!-- payment methods -->
                <div class="mb-3">
                    <label for="paymentMethod" class="form-label">Método de Pago:</label>
                    <select id="paymentMethod" v-model="bill.facturaMetodoPago" class="form-control" required>
                        <option value="">Seleccione un método de pago...</option>
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>

                <div class="totals">
                    <h3>Subtotal: RD$ {{ totalPrice }}</h3>
                    <h3>ITBIS: RD$ {{ totalPrice * 0.18 }}</h3>
                    <h3>Total: RD$ {{ totalPrice + (totalPrice * 0.18) }}</h3>
                </div>

                <button style="width:100%" type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Registrar Contrato
                </button>
            </form>
        </div>
    </div>
    </center>
    &nbsp;
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'
    import vSelect from 'vue-select'
    import "vue-select/dist/vue-select.css";

    export default {
        components: { vSelect },
        data() {
            return {           
                isSubmitting: false,     
                showModal: false,
                modalMessage: '',
                selectedService: '',
                services: [],
                totalPrice: 0,
                dni: '',
                contract: {
                    contratoId: '',
                    clienteDni: '',
                    servicioCod: '',
                    contratoDescripcion: '',
                    servicioPrecio: '',
                    contratoFechaInicio: '',
                    contratoFechaVencimiento: ''
                },
                bill: {
                    clienteDni: '',
                    facturaDetalle: '',
                    facturaDescripcion: '',
                    facturaSubtotal: '',
                    facturaMetodoPago: '',
                }
            }
        },
        created() {
            this.retrieveServices()
        },
        methods: {
            retrieveServices() {                
                ipcRenderer.send('retrieve-services') // ask main process to retrieve contracts

                // listen for main process response
                ipcRenderer.once('services-retrieved', (event, services) => {
                    console.log('services retrieved event received:', services)                                        

                    this.services = services
                })
            },       
            submitForm() {
                this.isSubmitting = true;
    
                const contractData = {
                    contratoId: this.contract.contratoId,
                    clienteDni: this.contract.clienteDni,
                    servicioCod: this.contract.servicioCod,
                    contratoDescripcion: this.contract.contratoDescripcion,
                    servicioPrecio: this.contract.servicioPrecio,
                    contratoFechaInicio: this.contract.contratoFechaInicio,
                    contratoFechaVencimiento: this.contract.contratoFechaVencimiento
                }

                const billData = {
                    clienteDni: this.contract.clienteDni,
                    facturaDetalle: this.contract.contratoDescripcion,
                    facturaDescripcion: 'Pago de Servicio',
                    facturaSubtotal: this.contract.servicioPrecio,
                    facturaMetodoPago: this.bill.facturaMetodoPago
                }

                ipcRenderer.send('add-contract', contractData);
                ipcRenderer.send('create-contract-bill', billData);
                
                ipcRenderer.once('contract-bill-created', (event, bill) => {
                    console.log('contract-bill-created event received:', bill);
                });
                
                ipcRenderer.once('contract-added', (event, createdContract) => {
                    console.log('contract-added event received:', createdContract);
                    this.dni = createdContract.clienteDni;
                    console.log('dni:', this.dni)
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = 'Contrato agregado exitosamente...';
                });

                ipcRenderer.once('contract-already-exists', (event, contract) => {
                    console.log('contract-already-exists event received:', contract);
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = 'Ya existe un cliente con ese DNI...';
                });

                ipcRenderer.once('error-adding-contract', (event, error) => {
                    console.log('error-adding-contract event received:', error);
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = 'Ha ocurrido un error al intentar agregar el contrato...';
                    
                });
            },
            onServiceSelected() {
                console.log('service selected:', this.selectedService)
                
                // extract properties
                this.contract.servicioCod = this.selectedService.servicioCod
                this.contract.servicioPrecio = this.selectedService.servicioPrecio
                this.totalPrice = this.selectedService.servicioPrecio
            }
        },
        beforeUnmount() {
            ipcRenderer.removeAllListeners('contract-added');
            ipcRenderer.removeAllListeners('contract-already-exists');
            ipcRenderer.removeAllListeners('error-adding-contract');
        },
        setup() {
            return { collapsed, toggleSidebar }
        }
    }
</script>

<style scoped>
    .v-select .vs__dropdown-menu {
        border: 1px solid #ccc;
        border-radius: 4px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
    }
    .v-select .vs__selected-options {
        padding: 10px 15px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
    }

    .modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
    }
    .card {
        margin-left: 15%;
        margin-right: 15%;
        margin-top: 8%;
        overflow-y: hidden;                
    }

    .card-body {
        text-align: left;
        margin-left: 15px;
        margin-right: 15px;
    }

    .shadow-sm {
        box-shadow: 0 0 40px rgb(0 0 0 / 25%) !important; 
    }

    .view-title {
        font-size: 2em;
        text-align: left;
        padding-top: 15px;
        margin-bottom: 20px;
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