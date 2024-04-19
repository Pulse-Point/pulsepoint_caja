<p align="center">
  <img src="https://github.com/Pulse-Point/pulsepoint_caja/assets/99276259/42f7a84c-1179-493e-b71e-6148445fc943" width="200">
</p>

# pulsepoint_caja

Esta es la aplicación de caja desarrollada para manejar operaciones de cobro con respecto a la empresa PulsePoint.

Este proyecto ha sido desarrollado en el framework ElectronJS, el cual ha sido integrado con VueJS para agilizar el proceso de desarrollo y obtener buenos resultados.

La aplicación presenta integración con el Core y la API de PulsePoint. En caso de un error en la integración de uno de estos, la caja es totalmente funcional con su base de datos local, y todas las peticiones fallidas entrarán en una cola local, la cual intentará reenviar las peticiones como sea posible. Esta cola se guarda en el almacenamiento local de Electron para poder recuperar la misma cola sin importar cuántas veces se cierre la aplicación.

## Configuration del proyecto

1. Installar NodeJS
2. Ir a la carpeta raíz del proyecto y ejecutar el comando:

```
npm install
```

### Iniciar la aplicación (Desarrollo)

```
npm run electron:serve
```

### Compilar la aplicación para producción

```
npm run electron:build
```

### Demostración

![image](https://github.com/Pulse-Point/pulsepoint_caja/assets/99276259/875cceb1-2312-42de-83a7-b09a7c983b7f)

![image](https://github.com/Pulse-Point/pulsepoint_caja/assets/99276259/6f57a38a-ac6d-4a29-835a-e648ded22df4)

![image](https://github.com/Pulse-Point/pulsepoint_caja/assets/99276259/c2b6799f-25ad-4abe-add5-efcdc645d017)


### Créditos

Realizado con propósitos educativos para la universidad de INTEC.

```
npm run lint
```
