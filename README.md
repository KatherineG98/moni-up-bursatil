# 📈 MoniUp - Simulador Bursátil

Plataforma educativa para la simulación de inversiones financieras. El sistema integra datos en tiempo real mediante proxy CORS hacia Yahoo Finance y la API de CoinGecko, permitiendo a los usuarios practicar la gestión de un portafolio de activos sin riesgo real.

## Características

- **Simulación de Mercado**: Compra y venta de activos con un saldo virtual inicial de $10,000 USD.
- **Cotizaciones en Tiempo Real**: Consumo de APIs externas para obtener precios actualizados de acciones y criptomonedas.
- **Prevención XSS**: Sanitización de strings en tiempo de ejecución utilizando `DOMPurify` mediante una directiva personalizada (`v-sanitize`).
- **Persistencia Local**: Almacenamiento centralizado del saldo, portafolio y configuración de interfaz, aplicando ofuscación Base64 en el Storage del navegador.
- **Autenticación**: Integración con Firebase Authentication para el registro de usuarios, inicio de sesión y persistencia de sesión.
- **Interfaz Gráfica**: Construcción de UI mediante Tailwind CSS v4 y componentes de DaisyUI, incluyendo soporte nativo para los modos Claro y Oscuro del sistema operativo.

## Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Tooling**: Vite
- **Estilos**: Tailwind CSS v4 + DaisyUI
- **Estado**: Pinia
- **Base de Datos / Auth**: Firebase
- **Testing**: Vitest + Vue Test Utils + jsdom

## Estructura del Proyecto

- `src/views/`: Vistas de enrutamiento principal (Dashboard, Autenticación, Landing).
- `src/stores/`: Lógica de estado persistente (Pinia) dividida por dominio (Auth, Market, Portfolio, Crypto).
- `src/services/`: Clases y funciones centralizadas para la comunicación con Firebase, APIs de terceros y LocalStorage.
- `src/components/`: Componentes modulares de interfaz de usuario.
- `src/router/`: Configuración del enrutador de Vue, incluyendo Navigation Guards para proteger las rutas privadas.
- `src/tests/`: Suites de pruebas unitarias y de integración desarrolladas con Vitest.

## Instalación

1. Clona el repositorio en tu máquina local.
2. Posiciónate en la raíz del proyecto y ejecuta la instalación de las dependencias de Node:

```bash
npm install
```

3. (Opcional) Configura tus variables de entorno para Firebase creando un archivo `.env` basado en la plantilla del repositorio.

4. Inicia el servidor de desarrollo local:

```bash
npm run dev
```

## Testing (Pruebas Unitarias e Integración)

El proyecto incluye una arquitectura de Type-Driven Development (TDD) cubriendo componentes aislados, utilerías de formateo y el ciclo de vida asíncrono con los Stores.

Para ejecutar los tests, utiliza los siguientes comandos en la terminal desde la raíz del proyecto:

- **Correr todas las pruebas:** `npm run test`
- **Correr solo pruebas unitarias:** `npm run test:unit`
- **Correr pruebas de integración:** `npm run test:integration`
- **Ver el reporte matemático de cobertura de código:** `npm run test:coverage`
- **Desplegar la interfaz gráfica de Vitest en el navegador:** `npm run test:ui`
