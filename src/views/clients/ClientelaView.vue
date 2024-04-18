<template>
    <h1 class="view-title">Administrar Clientes</h1>
    <div class="spinner-border spinner-border-lg" v-show="loading" role="status">
        <span class="sr-only">Loading...</span>
    </div>
    <div class="action-menu">
        <button class="btn btn-primary" @click="$router.push('/clientela/add')">Añadir Cliente</button>

        <div style="width: 40%" class="input-group mb-3">
            <input v-model="searchText" @input="handleInputChange" type="text" class="form-control" placeholder="Escriba el nombre del cliente...">
        </div>
    </div>
    <div class="table-section" v-show="!loading">
        <table class="content-table">
            <thead>
                <tr>
                    <th scope="col">DNI</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Email</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="client in filteredClients" :key="client.clienteDni">
                    <td>{{ client.clienteDni }}</td>
                    <td>{{ client.clienteNombre }}</td>
                    <td>{{ client.clienteApellido }}</td>
                    <td>{{ client.clienteEmail }}</td>
                    <td>{{ client.clienteTelefono }}</td>
                    <td>{{ client.clienteDireccion }}</td>
                    <td>
                        <button class="btn btn-outline-primary" @click="$router.push(`/clientela/edit/${client.clienteDni}`)">Editar</button>                    
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
                loading: true,
                clients: [],
                filteredClients: [],                
                searchText: ''
            }
        },
        methods: {
            retrieveClients() {                
                ipcRenderer.send('retrieve-clients') // ask main process to retrieve clients

                // listen for main process response
                ipcRenderer.once('clients', (event, clients) => {
                    console.log('clients event received:', clients)                                        

                    this.clients = clients
                    this.filteredClients = clients
                    this.loading = false
                })
            },            
            handleInputChange() {
                // Filter clients based on input text
                this.filteredClients = this.clients.filter(client => {
                    return client.clienteNombre.toLowerCase().includes(this.searchText.toLowerCase()) ||
                        client.clienteApellido.toLowerCase().includes(this.searchText.toLowerCase())
                })
            },            
        },
        async created() {            
            this.retrieveClients()
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