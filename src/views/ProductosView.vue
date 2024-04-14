<template>
    <div class="action-menu">
        <div class="buttons">
            <button class="button is-primary">Facturar productos</button>
        </div>
    </div>
</template>

<script>
    import { collapsed, toggleSidebar } from '@/components/sidebar/state'

    export default {
        setup() {
            return { collapsed, toggleSidebar }
        }
    }
</script>