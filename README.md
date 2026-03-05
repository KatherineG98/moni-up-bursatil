# 📈 MoniUp - Simulador Bursátil

Plataforma educativa para la simulación de inversiones financieras. El sistema integra datos en tiempo real mediante proxy CORS hacia Yahoo Finance, la API de CoinGecko y la API de Finnhub, permitiendo a los usuarios practicar la gestión de un portafolio de activos sin riesgo real.

## Características

- **Simulación de Mercado**: Compra y venta de activos con un saldo virtual inicial de $10,000 USD.
- **Cotizaciones en Tiempo Real**: Consumo de APIs externas para obtener precios actualizados de acciones y criptomonedas.
- **Noticias Financieras**: Consulta de noticias del mercado general y por empresa mediante la API de Finnhub. Incluye paginación, filtros por categoría y estado de lectura, e historial de noticias visitadas almacenado en Firestore.
- **Traducción de Artículos**: Traducción bajo demanda de titulares y resúmenes de noticias del inglés al español utilizando la API de MyMemory.
- **Comentarios en Noticias**: Sistema de comentarios por artículo con escritura y lectura en tiempo real sobre Firebase Firestore. Las reglas del servidor validan la identidad del autor y limitan la longitud del texto a 300 caracteres.
- **Notificaciones de UI**: Retroalimentación visual de acciones y errores mediante `SweetAlert2` en lugar de alertas nativas del navegador.
- **Prevención XSS**: Sanitización de strings en tiempo de ejecución utilizando `DOMPurify` mediante una directiva personalizada (`v-sanitize`).
- **Persistencia Local**: Almacenamiento centralizado del saldo, portafolio y configuración de interfaz, aplicando ofuscación Base64 en el Storage del navegador.
- **Autenticación**: Integración con Firebase Authentication para el registro de usuarios, inicio de sesión y persistencia de sesión.
- **Interfaz Gráfica**: Construcción de UI mediante Tailwind CSS v4 y componentes de DaisyUI, incluyendo soporte nativo para los modos Claro y Oscuro del sistema operativo.

## Stack Tecnológico

- **Framework**: Vue 3 (Composition API)
- **Tooling**: Vite
- **Estilos**: Tailwind CSS v4 + DaisyUI
- **Estado**: Pinia
- **Base de Datos / Auth**: Firebase (Authentication, Firestore)
- **APIs Externas**: Finnhub (noticias), MyMemory (traducción), CoinGecko (criptomonedas), Yahoo Finance proxy (acciones)
- **Notificaciones**: SweetAlert2
- **Testing**: Vitest + Vue Test Utils + jsdom

## Estructura del Proyecto

- `src/views/`: Vistas de enrutamiento principal (Dashboard, Autenticación, Landing).
- `src/stores/`: Lógica de estado persistente (Pinia) dividida por dominio (Auth, Market, Portfolio, Crypto, News).
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

3. Configura tus variables de entorno creando un archivo `.env` basado en `.env.example`. Las variables incluyen las credenciales de Firebase y la API Key de Finnhub.

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

## Variables de Entorno

El archivo `.env.example` contiene la plantilla de todas las variables requeridas. Copia el archivo como `.env` y completa cada valor con tus credenciales.

| Variable                            | Descripción                                                                                                                   | Obligatoria |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `VITE_FIREBASE_API_KEY`             | Clave pública del proyecto en Firebase Console.                                                                               | Sí          |
| `VITE_FIREBASE_AUTH_DOMAIN`         | Dominio de autenticación asignado por Firebase.                                                                               | Sí          |
| `VITE_FIREBASE_PROJECT_ID`          | Identificador único del proyecto en Firebase.                                                                                 | Sí          |
| `VITE_FIREBASE_STORAGE_BUCKET`      | Bucket de almacenamiento de Firebase Storage.                                                                                 | Sí          |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | ID del remitente para Firebase Cloud Messaging.                                                                               | Sí          |
| `VITE_FIREBASE_APP_ID`              | ID de la aplicación web registrada en Firebase.                                                                               | Sí          |
| `VITE_FIREBASE_MEASUREMENT_ID`      | ID de Google Analytics asociado al proyecto.                                                                                  | No          |
| `VITE_FINNHUB_API_KEY`              | Clave de acceso a la API de Finnhub para noticias financieras. Se obtiene registrándose en [finnhub.io](https://finnhub.io/). | Sí          |

## APIs Utilizadas

| API                        | Uso en el proyecto                                         | Requiere API Key | Documentación                                                           |
| -------------------------- | ---------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------- |
| Yahoo Finance (proxy CORS) | Cotización de acciones en tiempo real.                     | No               | —                                                                       |
| CoinGecko                  | Cotización de criptomonedas en tiempo real.                | No               | [docs.coingecko.com](https://docs.coingecko.com/)                       |
| Finnhub                    | Noticias financieras del mercado general y por empresa.    | Sí               | [finnhub.io/docs](https://finnhub.io/docs/api)                          |
| MyMemory                   | Traducción de titulares y resúmenes de noticias (EN → ES). | No               | [mymemory.translated.net](https://mymemory.translated.net/doc/spec.php) |

## Seguridad

El proyecto implementa las siguientes medidas de protección:

- **Sanitización de entrada (XSS)**: Todo texto renderizado dinámicamente pasa por `DOMPurify` mediante la directiva global `v-sanitize`. No se utiliza `v-html` en ningún componente.
- **Sanitización de datos de API**: Los resúmenes de noticias provenientes de Finnhub se procesan con una función de limpieza de HTML en dos pasos (decodificación de entidades + extracción de texto plano) antes de almacenarse en el estado.
- **Validación del lado del servidor (Firestore Rules)**: Las reglas de seguridad validan el esquema de datos (`hasOnly`, `is string`, `size()`), restringen la escritura al propietario de la sesión (`request.auth.uid`) y deniegan toda operación no autorizada por defecto.
- **Validación del lado del cliente**: Los formularios de registro y login validan formato de email (Regex), longitud mínima de contraseña (8 caracteres) y aplican `maxlength` en todos los campos de entrada.
- **Protección de rutas**: Vue Router utiliza un Navigation Guard global (`beforeEach`) que valida el estado de autenticación antes de permitir el acceso a rutas protegidas.
- **Rate limiting de comentarios**: El cliente impone un intervalo mínimo de 5 minutos entre comentarios por usuario, almacenado en `localStorage`.
- **Variables de entorno**: El archivo `.env` está incluido en `.gitignore` para prevenir la exposición de credenciales en el repositorio.

## Licencia

Este proyecto fue desarrollado con fines educativos. Distribuido bajo la licencia [MIT](https://opensource.org/licenses/MIT).
