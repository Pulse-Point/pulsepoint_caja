<template>
    <button style="margin-top: 10px; width: 25%; margin-bottom: -8%;" class="btn btn-outline-primary"
        @click="$router.push(`/contratos/view/${bill.clienteDni}`)">Volver</button>
    <div class="card shadow-sm rounded" style="padding: 10px;">      
        <button class="btn btn-primary" style="width:10%;" @click="generatePDF">
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_98_2)">
                <path d="M5.46875 17.5C5.75883 17.5 6.03703 17.3848 6.24215 17.1796C6.44727 16.9745 6.5625 16.6963 6.5625 16.4062C6.5625 16.1162 6.44727 15.838 6.24215 15.6329C6.03703 15.4277 5.75883 15.3125 5.46875 15.3125C5.17867 15.3125 4.90047 15.4277 4.69535 15.6329C4.49023 15.838 4.375 16.1162 4.375 16.4062C4.375 16.6963 4.49023 16.9745 4.69535 17.1796C4.90047 17.3848 5.17867 17.5 5.46875 17.5Z" fill="white"/>
                <path d="M10.9375 2.1875C9.77718 2.1875 8.66438 2.64844 7.84391 3.46891C7.02344 4.28938 6.5625 5.40218 6.5625 6.5625V10.9375H4.375C3.21468 10.9375 2.10188 11.3984 1.28141 12.2189C0.460936 13.0394 0 14.1522 0 15.3125L0 21.875C0 23.0353 0.460936 24.1481 1.28141 24.9686C2.10188 25.7891 3.21468 26.25 4.375 26.25H6.5625V28.4375C6.5625 29.5978 7.02344 30.7106 7.84391 31.5311C8.66438 32.3516 9.77718 32.8125 10.9375 32.8125H24.0625C25.2228 32.8125 26.3356 32.3516 27.1561 31.5311C27.9766 30.7106 28.4375 29.5978 28.4375 28.4375V26.25H30.625C31.7853 26.25 32.8981 25.7891 33.7186 24.9686C34.5391 24.1481 35 23.0353 35 21.875V15.3125C35 14.1522 34.5391 13.0394 33.7186 12.2189C32.8981 11.3984 31.7853 10.9375 30.625 10.9375H28.4375V6.5625C28.4375 5.40218 27.9766 4.28938 27.1561 3.46891C26.3356 2.64844 25.2228 2.1875 24.0625 2.1875H10.9375ZM8.75 6.5625C8.75 5.98234 8.98047 5.42594 9.3907 5.0157C9.80094 4.60547 10.3573 4.375 10.9375 4.375H24.0625C24.6427 4.375 25.1991 4.60547 25.6093 5.0157C26.0195 5.42594 26.25 5.98234 26.25 6.5625V10.9375H8.75V6.5625ZM10.9375 17.5C9.77718 17.5 8.66438 17.9609 7.84391 18.7814C7.02344 19.6019 6.5625 20.7147 6.5625 21.875V24.0625H4.375C3.79484 24.0625 3.23844 23.832 2.8282 23.4218C2.41797 23.0116 2.1875 22.4552 2.1875 21.875V15.3125C2.1875 14.7323 2.41797 14.1759 2.8282 13.7657C3.23844 13.3555 3.79484 13.125 4.375 13.125H30.625C31.2052 13.125 31.7616 13.3555 32.1718 13.7657C32.582 14.1759 32.8125 14.7323 32.8125 15.3125V21.875C32.8125 22.4552 32.582 23.0116 32.1718 23.4218C31.7616 23.832 31.2052 24.0625 30.625 24.0625H28.4375V21.875C28.4375 20.7147 27.9766 19.6019 27.1561 18.7814C26.3356 17.9609 25.2228 17.5 24.0625 17.5H10.9375ZM26.25 21.875V28.4375C26.25 29.0177 26.0195 29.5741 25.6093 29.9843C25.1991 30.3945 24.6427 30.625 24.0625 30.625H10.9375C10.3573 30.625 9.80094 30.3945 9.3907 29.9843C8.98047 29.5741 8.75 29.0177 8.75 28.4375V21.875C8.75 21.2948 8.98047 20.7384 9.3907 20.3282C9.80094 19.918 10.3573 19.6875 10.9375 19.6875H24.0625C24.6427 19.6875 25.1991 19.918 25.6093 20.3282C26.0195 20.7384 26.25 21.2948 26.25 21.875Z" fill="white"/>
                </g>
                <defs>
                <clipPath id="clip0_98_2">
                <rect width="35" height="35" fill="white"/>
                </clipPath>
                </defs>
            </svg>
        </button>  

        <div class="invoice-container" style="margin-left: 75px; margin-right: 75px; margin-top: 25px; margin-bottom: 25px; text-align: initial;">
            <div class="header" style="text-align: center; font-family: Arial, sans-serif;">
                <h1><strong>PulsePoint</strong></h1>
                <p>INTEC</p>
            </div>
            <div class="separator" style="border-top: 1px solid black; margin-top: 18px; margin-bottom: 20px;"></div>
            <div class="left-column" style="float: left; width: 50%; font-family: Arial, sans-serif;">
                <p style="font-size: 18px;"><strong>Tel:</strong> 8298175559</p>
                <p style="font-size: 18px;"><strong>Fecha:</strong> {{ new Date().toLocaleDateString() }}</p>
                <p style="font-size: 18px;"><strong>Cliente:</strong> {{ bill.clienteDni }}</p>
                <p style="font-size: 18px;"><strong>RNC:</strong> </p>
            </div>
            <div class="right-column" style="float: right; width: 50%; text-align: right; font-family: Arial, sans-serif;">
                <p style="font-size: 18px;"><strong>Factura:</strong> {{ bill.facturaCod }}</p>
                <p style="font-size: 18px;"><strong>Cond:</strong> Contado</p>
                <p style="font-size: 18px;"><strong>Factura de Consumo:</strong> {{ bill.facturaCod }}</p>
                <p style="font-size: 18px;"><strong>Valida hasta:</strong> N/A</p>
                <p style="font-size: 18px; color: White">BLANCO</p>
            </div>
            <table style="width: 100%">
                <tr>
                    <th style="padding-right: 5px;font-size: 16px; font-family: Arial, sans-serif;">
                        Descripcion/Referencia</th>
                    <th style="padding-right: 5px;font-size: 16px; font-family: Arial, sans-serif;">Precio</th>
                    <th style="padding-right: 5px;font-size: 16px; font-family: Arial, sans-serif;">Itbis</th>
                    <th style="padding-right: 5px;font-size: 16px; font-family: Arial, sans-serif;">Importe</th>
                </tr>
                <td style="font-size: 16px; font-family: Arial, sans-serif;">{{ bill.facturaDescripcion }}</td>
                <td style="font-size: 16px; font-family: Arial, sans-serif;">{{ bill.facturaSubtotal }}</td>
                <td style="font-size: 16px; font-family: Arial, sans-serif;">{{ bill.facturaItbis }}</td>
                <td style="font-size: 16px; font-family: Arial, sans-serif;">{{ bill.facturaTotal }}</td>
            </table>
            <div class="separator" style="border-top: 1px solid black; margin-top: 18px; margin-bottom: 20px;"></div>
            <table style="width: 100%">                
                <tr>
                    <td style="padding-right: 60px; font-size: 18px; font-family: Arial, sans-serif;">Gavado:</td>
                    <td style="font-size: 18px; font-family: Arial, sans-serif;">{{ bill.facturaSubtotal }}</td>
                </tr>
                <tr>
                    <td style="padding-right: 60px; font-size: 18px; font-family: Arial, sans-serif;">Impuesto:</td>
                    <td style="font-size: 18px; font-family: Arial, sans-serif;">{{ bill.facturaItbis }}</td>
                </tr>               
                <tr>
                    <td style="padding-right: 60px; font-size: 24px; font-family: Arial, sans-serif;"><strong>Total
                            Neto RD$:</strong></td>
                    <td style="font-size: 24px; font-family: Arial, sans-serif;"><strong>{{ bill.facturaTotal
                            }}</strong></td>
                </tr>
            </table>
            <div class="separator" style="margin-bottom: 10px;"></div>
            <center>
                <p style="font-family: Arial, sans-serif;">Gracias por su compra, Vuelva pronto!</p>
                <p style="font-family: Arial, sans-serif;">No devolucion de efectivo. Para cambio traer factura
                    dentro de 48 horas.</p>
            </center>
            <div class="separator"></div>
        </div>
    </div>
    &nbsp;
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'  
    import { ipcRenderer } from 'electron'
    import jsPDF from 'jspdf';
    import html2canvas from 'html2canvas';

    export default {
        data() {
            return {           
                bill: {
                    facturaCod: '',
                    clienteDni: '',
                    sucursalId: '',
                    facturaDetalle: '',
                    facturaDescripcion: '',
                    facturaMetodoPago: '',
                    facturaItbis: '',
                    facturaSubtotal: '',
                    facturaTotal: ''
                }
            }
        },
        created() {
            const dni = this.$route.params.dni;
            this.retrieveData(dni)
        },
        methods: {
            retrieveData(dni) {                
                ipcRenderer.send('retrieve-a-bill', dni) 
                
                ipcRenderer.once('bill-retrieved', (event, bill) => {
                    this.bill = bill
                })                
            },    
            async generatePDF() {
                const invoice = document.querySelector('.invoice-container');
                const canvas = await html2canvas(invoice);
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'PNG', 15, 10);
                pdf.save(`factura-${this.bill.facturaCod}.pdf`);
            },        
        },
        beforeUnmount() {
            ipcRenderer.removeAllListeners('bill-retrieved');
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