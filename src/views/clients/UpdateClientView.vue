<template>
    <button style="margin-top: 10px; width: 25%; margin-bottom: -8%;" class="btn btn-outline-primary"
        @click="$router.push('/clientela')">Volver</button>
    <!-- Modal -->
    <transition name="fade">
        <div v-if="showModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; display: flex; justify-content: center; align-items: center;">
            <div style="background-color: white; padding: 20px; margin: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.5); max-width: 500px;">
                <h2 style="font-size: 24px; color: #333; text-align: center;">Resultado</h2>
                <p style="font-size: 18px; color: #666; line-height: 1.6;">{{ modalMessage }}</p>        
                <button class="btn btn-primary" @click="$router.push('/clientela')">Aceptar</button>
            </div>
        </div>
    </transition>
    <div class="card shadow-sm rounded">
        <div class="card-body text-left">
            <h1 class="card-title view-title">Modificar un Cliente</h1>
            <form @submit.prevent="submitForm">
                <div class="mb-3">
                    <label for="dni" class="form-label">DNI:</label>
                    <input id="dni" v-model="client.clienteDni" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre:</label>
                    <input id="nombre" v-model="client.clienteNombre" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="apellido" class="form-label">Apellido:</label>
                    <input id="apellido" v-model="client.clienteApellido" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email:</label>
                    <input id="email" v-model="client.clienteEmail" type="email" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="telefono" class="form-label">Telefono:</label>
                    <input id="telefono" v-model="client.clienteTelefono" type="text" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="direccion" class="form-label">Direccion:</label>
                    <input id="direccion" v-model="client.clienteDireccion" type="text" class="form-control" required>
                </div>

                <button style="width:100%" type="submit" class="btn btn-primary" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm" role="status"
                        aria-hidden="true"></span>
                    Modificar Ciente
                </button>
            </form>
        </div>
    </div>
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'

    export default {
        data() {
            return {           
                isSubmitting: false,     
                showModal: false,
                modalMessage: '',
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
            ipcRenderer.send('retrieve-a-client', dni);

            ipcRenderer.once('client-retrieved', (event, client) => {
                console.log('client retrieval event received:', client);
                this.client = client;
            });

            ipcRenderer.once('error-retrieving-client', (event, error) => {
                console.log('error-retrieving-client event received:', error);
                this.showModal = true;
                this.modalMessage = 'Ha ocurrido un error al intentar recuperar el cliente...';
            });
        },
        methods: {
            submitForm() {
                this.isSubmitting = true;
    
                const clientData = {
                    clienteDni: this.client.clienteDni,
                    clienteNombre: this.client.clienteNombre,
                    clienteApellido: this.client.clienteApellido,
                    clienteEmail: this.client.clienteEmail,
                    clienteTelefono: this.client.clienteTelefono,
                    clienteDireccion: this.client.clienteDireccion
                };

                ipcRenderer.send('update-client', clientData);

                ipcRenderer.once('client-updated', (event, client) => {
                    console.log('client-updated event received:', client);
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = 'Cliente actualizado exitosamente...';
                });

                ipcRenderer.once('error-updating-client', (event, error) => {
                    console.log('error-updating-client event received:', error);
                    this.isSubmitting = false;
                    this.showModal = true;
                    this.modalMessage = 'Ha ocurrido un error al intentar modificar el cliente...';
                    
                });
            }
        },
        beforeUnmount() {
            ipcRenderer.removeAllListeners('client-updated');
            ipcRenderer.removeAllListeners('error-updating-client');

        },
        setup() {
            return { collapsed, toggleSidebar }
        }
    }
</script>

<style scoped>

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