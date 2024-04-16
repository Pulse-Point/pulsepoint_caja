<template>
    <h1 class="view-title">Administrar Contratos</h1>
    <div class="action-menu">
        <button class="btn btn-primary" style="width: 30%;" @click="$router.push('/contratos/add')">Añadir Contrato</button>
        
        <div style="width: 100%" class="input-group mb-3">
            <input v-model="searchText" @input="handleInputChange" type="text" class="form-control" placeholder="Escriba el DNI asociado al contrato...">                
        </div>
        
        <label style="margin-top: 1%" for="filter">Filtro:</label>
        <select style="width: 35%;" v-model="filter" class="form-control" @change="filterContracts">
            <option value="all">Todos</option>
            <option value="notExpired">Vigentes</option>
            <option value="expired">Expirados</option>
        </select>
    </div>
    <div class="table-section">
        <table class="content-table">
            <thead>
                <tr>
                    <th scope="col">DNI de Cliente</th>
                    <th scope="col">Fecha Inicio</th>
                    <th scope="col">Fecha Vencimiento</th>                    
                    <th scope="col">Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="contract in filteredContracts" :key="contract.clienteDni">
                    <td>{{ contract.clienteDni }}</td>
                    <td>{{ formatDate(contract.contratoFechaInicio) }}</td>
                    <td :class="{ green: !isExpired(contract.contratoFechaVencimiento), red: isExpired(contract.contratoFechaVencimiento) }">
                        {{ formatDate(contract.contratoFechaVencimiento) }}
                    </td>
                    <td style="display: flex; align-items: center; justify-content: space-evenly;">
                        <button class="btn btn-outline-primary" @click="$router.push(`/contratos/view/${contract.clienteDni}`)">Información</button>
                        <button class="btn btn-outline-primary" @click="$router.push(`/contratos/edit/${contract.clienteDni}`)">Editar</button>                    
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
                contracts: [],
                services: [],
                filteredContracts: [],                
                searchText: '',
                filter: 'all'
            }
        },
        methods: {
            fetchContracts() {
                // Fetch contracts from database
                ipcRenderer.send('retrieve-contracts') // ask main process to retrieve contracts

                ipcRenderer.once('contracts-retrieved', (event, contracts) => {
                    this.contracts = contracts
                    this.filteredContracts = contracts
                })                
            },                 
            handleInputChange() {
                // Filter clients based on input text
                this.filteredContracts = this.contracts.filter(contract => {
                    return contract.clienteDni.toLowerCase().includes(this.searchText.toLowerCase()) 
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
            filterContracts() {
                console.log('filtering to: ', this.filter)
                if (this.filter === 'all') {
                    this.filteredContracts = this.contracts
                } else if (this.filter === 'expired') {
                    this.filteredContracts = this.contracts
                    this.filteredContracts = this.filteredContracts.filter(contract => this.isExpired(contract.contratoFechaVencimiento))
                } else if (this.filter === 'notExpired') {
                    this.filteredContracts = this.contracts
                    this.filteredContracts = this.filteredContracts.filter(contract => !this.isExpired(contract.contratoFechaVencimiento))
                }
            },
        },
        async created() {       
            this.fetchContracts()     
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

    .green {
        color: green;
    }

    .red {
        color: red;
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