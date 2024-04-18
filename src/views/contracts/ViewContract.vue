<template>
    <button style="margin-top: 10px; width: 25%; margin-bottom: -8%;" class="btn btn-outline-primary"
        @click="$router.push('/contratos')">Volver</button>
    <div class="card shadow-sm rounded">
        <div class="card-body text-left">
            <h1 class="card-title view-title">Datos del contrato</h1>
            
            <div style="display: flex; justify-content: space-between; padding: 1em; border-radius: 5px; font-size: large">
                <div class="client-data" style="width: 48%; padding: 1em; background-color: rgb(227 228 255); border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h4 style="margin-bottom: 1em;">Información del Cliente</h4>
                    <p><strong>DNI:</strong></p>
                    <p>{{ client.clienteDni }}</p>
                    <p><strong>Nombre:</strong></p>
                    <p>{{ client.clienteNombre }}</p>
                    <p><strong>Apellido:</strong></p>
                    <p>{{ client.clienteApellido }}</p>
                    <p><strong>Email:</strong></p>
                    <p>{{ client.clienteEmail }}</p>
                    <p><strong>Teléfono:</strong></p>
                    <p>{{ client.clienteTelefono }}</p>
                    <p><strong>Dirección:</strong></p>
                    <p>{{ client.clienteDireccion }}</p>                
                </div>
    
                <div class="contract-data" style="width: 48%; padding: 1em; background-color: rgb(227 228 255); border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h4 style="margin-bottom: 1em;">Información del Contrato</h4>
                    <p><strong>Descripción:</strong></p>
                    <p>{{ contract.contratoDescripcion }}</p>
                    <p><strong>Servicio:</strong></p>
                    <p>{{ contract.servicioCod }}</p>
                    <p><strong>Precio:</strong></p>
                    <p>RD$ {{ contract.servicioPrecio }}</p>
                    <p><strong>Fecha de Inicio:</strong></p>
                    <p>{{ formatDate(contract.contratoFechaInicio) }}</p>
                    <p><strong>Fecha de Vencimiento:</strong></p>
                    <p :class="{ green: !isExpired(contract.contratoFechaVencimiento), red: isExpired(contract.contratoFechaVencimiento) }">
                        {{ formatDate(contract.contratoFechaVencimiento) }}
                    </p>
                </div>            
            </div>

            <button style="width: 48%; margin-right: 2%;" class="btn btn-outline-primary" @click="$router.push(`/contratos/edit/${routeParameter}`)">Editar</button>
            <button style="width: 48%;" class="btn btn-outline-primary" @click="$router.push(`/contratos/view/bill/${routeParameter}`)">Ver factura</button>
        </div>
    </div>
    &nbsp;
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'

    export default {
        data() {
            return {      
                routeParameter: this.$route.params.dni,     
                contract: {
                    clienteDni: '',
                    servicioCod: '',
                    contratoDescripcion: '',
                    servicioPrecio: '',
                    contratoFechaInicio: '',
                    contratoFechaVencimiento: ''
                },
                client: {
                    clienteDni: '',
                    clienteNombre: '',
                    clienteApellido: '',
                    clienteEmail: '',
                    clienteTelefono: '',
                    clienteDireccion: ''
                }
            }
        },
        created() {
            const dni = this.$route.params.dni;
            console.log('dni', dni)
            this.retrieveData(dni)
        },
        methods: {
            retrieveData(dni) {                
                ipcRenderer.send('retrieve-a-contract', dni) 
                ipcRenderer.send('retrieve-a-client', dni)
                
                ipcRenderer.once('contract-retrieved', (event, contract) => {
                    this.contract = contract
                })

                ipcRenderer.once('client-retrieved', (event, client) => {
                    this.client = client
                })
            },
            formatDate(dateString) {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                return new Date(dateString).toLocaleDateString('es-ES', options);
            },            
            isExpired(dateString) {
                const today = new Date();
                const expirationDate = new Date(dateString);
                return today > expirationDate;
            },
        },
        beforeUnmount() {
            ipcRenderer.removeAllListeners('contract-retrieved');
            ipcRenderer.removeAllListeners('client-retrieved');
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

    .green {
        color: green;
    }

    .red {
        color: red;
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
        margin-left: 12%;
        margin-right: 12%;
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