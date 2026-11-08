# UNIVERSIDAD TECNOLÓGICA DEL PERÚ (UTP)
## FACULTAD DE INGENIERÍA
### CURSO: DESARROLLO FULL STACK
**INFORME DE AVANCE DE PROYECTO FINAL 2 (APF2 — SEMANA 14)**

---

# TÍTULO DEL PROYECTO:
## PLATAFORMA WEB FULL STACK PARA LA GESTIÓN GASTRONÓMICA, AUTENTICACIÓN SEGURA Y CONTROL DE PEDIDOS EN TIEMPO REAL: "BRASAS & WOK"

---

**INFORMACIÓN GENERAL DEL CURSO Y EQUIPO:**
- **Curso:** Desarrollo Full Stack
- **Código del Curso:** [Código de Asignatura UTP]
- **Ciclo Académico:** IX Ciclo — 2026-II
- **Docente del Curso:** [Nombre del Docente Asesor]
- **Integrantes y Roles:**
  - **Martín J. Gonzales** (*Tech Lead / Full Stack Developer & DevOps Lead*)
  - **[Integrante 2 - Nombre y Apellidos]** (*Frontend Developer & UI/UX Specialist*)
  - **[Integrante 3 - Nombre y Apellidos]** (*Backend Developer & QA Testing Engineer*)
- **Fecha de Entrega:** Noviembre de 2026
- **Repositorio Oficial:** `https://github.com/MartinJGP/brasaswok`
- **Frontend Desplegado (Vercel):** `https://brasaswok.vercel.app`
- **Backend API Desplegado (Render):** `https://brasaswok-backend.onrender.com`
- **Documentación Swagger UI (OpenAPI):** `https://brasaswok-backend.onrender.com/swagger-ui/index.html`
- **Base de Datos Cloud (Aiven MySQL):** `mysql-utp-utp-gonzales.h.aivencloud.com:21487/brasas_wok_db`

---

## ÍNDICE GENERAL

1. [INTRODUCCIÓN](#introducción)
   - [Contexto y motivación](#contexto-y-motivación)
   - [Beneficios esperados para el usuario y el negocio](#beneficios-esperados-para-el-usuario-y-el-negocio)
   - [Estructura del documento](#estructura-del-documento)
2. [CAPÍTULO 1 · ASPECTOS GENERALES](#capítulo-1--aspectos-generales)
   - [1.1 Definición del problema](#11-definición-del-problema)
     - [1.1.1 Descripción del problema](#111-descripción-del-problema)
   - [1.2 Definición de objetivos](#12-definición-de-objetivos)
     - [1.2.1 Objetivo general](#121-objetivo-general)
     - [1.2.2 Objetivos específicos](#122-objetivos-específicos)
     - [1.2.3 Alcances y limitaciones](#123-alcances-y-limitaciones)
   - [1.3 Stakeholders y público objetivo](#13-stakeholders-y-público-objetivo)
   - [1.4 Reglas de negocio](#14-reglas-de-negocio)
   - [1.5 Métricas de éxito (KPI)](#15-métricas-de-éxito-kpi)
3. [CAPÍTULO 2 · MARCO TEÓRICO](#capítulo-2--marco-teórico)
   - [2.1 Antecedentes y Benchmark](#21-antecedentes-y-benchmark)
   - [2.2 Fundamento teórico](#22-fundamento-teórico)
   - [2.3 Tecnologías seleccionadas y justificación](#23-tecnologías-seleccionadas-y-justificación)
4. [CAPÍTULO 3 · DESARROLLO DE LA SOLUCIÓN](#capítulo-3--desarrollo-de-la-solución)
   - [3.1 Requerimientos funcionales y no funcionales](#31-requerimientos)
   - [3.2 Casos de uso](#32-casos-de-uso)
   - [3.3 Modelo de datos](#33-modelo-de-datos)
   - [3.4 Arquitectura de software](#34-arquitectura-de-software)
   - [3.5 Contratos de API](#35-contratos-de-api)
   - [3.6 Autenticación y Autorización (JWT y Seguridad en Tránsito)](#36-autenticación-y-autorización)
     - [3.6.1 Fundamentos de Seguridad, HTTPS y Manejo de Información Sensible](#361-fundamentos-de-seguridad-https-y-manejo-de-información-sensible)
     - [3.6.2 Flujo Detallado de JWT en el Inicio de Sesión (Logueo)](#362-flujo-detallado-de-jwt-en-el-inicio-de-sesión-logueo)
     - [3.6.3 Flujo Detallado de JWT en el Consumo de Servicios REST Protegidos](#363-flujo-detallado-de-jwt-en-el-consumo-de-servicios-rest-protegidos)
   - [3.7 Front-end (UI/UX)](#37-front-end-uiux)
   - [3.8 Back-end](#38-back-end)
   - [3.9 Comunicación en tiempo real (WebSockets STOMP)](#39-tiempo-real-o-integración-externa)
   - [3.10 Despliegue e infraestructura](#310-despliegue-e-infraestructura)
   - [3.11 Monitoreo y observabilidad](#311-monitoreo-y-observabilidad)
   - [3.12 Pruebas y calidad](#312-pruebas-y-calidad)
   - [3.13 Gestión del proyecto (Scrum & Burndown Chart a Semana 14)](#313-gestión-del-proyecto)

---

## INTRODUCCIÓN

### Contexto y motivación
En el mercado gastronómico peruano, los rubros de **Pollerías a la Brasa** y **Chifas / Fusión Wok** representan dos de los segmentos de mayor volumen de pedidos y fidelidad de clientes. Históricamente, las pollerías tradicionales y locales de salteados han gestionado sus órdenes mediante comandas manuscritas, llamadas telefónicas o chats de mensajería instantánea (como WhatsApp). Si bien estos mecanismos permitieron iniciar operaciones comerciales, han demostrado ser altamente ineficientes a medida que la demanda crece: generan cuellos de botella en horas pico, descoordinación entre meseros y el personal de cocina, errores en cobros y una nula trazabilidad para el cliente.

Asimismo, la dependencia de plataformas agregadoras de terceros (como PedidosYa o Rappi) supone comisiones elevadas (entre el 18% y el 30% del valor total de cada venta), además de la pérdida del control directo sobre la experiencia de usuario y la fidelización de clientes. 

Motivados por este escenario, el presente proyecto concibe y materializa **"Brasas & Wok"**: una solución full stack moderna, reactiva, desacoplada y escalable, diseñada para digitalizar de punta a punta el ciclo operativo de un restaurante que combina lo mejor del pollo a la brasa al carbón con el salteado criollo-oriental al wok a 300°C.

### Beneficios esperados para el usuario y el negocio
- **Para el Cliente:** Una interfaz pública rápida, intuitiva y responsive, donde puede explorar la carta interactiva, personalizar platos, administrar su carrito de compras en tiempo real, simular múltiples formas de pago (Tarjeta, Yape/Plin, Efectivo, Transferencia) y monitorear el estado exacto de su comanda sin necesidad de recargar la página gracias a conexiones persistentes con WebSockets.
- **Para el Personal de Cocina (KDS - Kitchen Display System):** Eliminación de comandas en papel. Las órdenes ingresadas entran en tiempo real a una pantalla táctil industrial con código de colores según el tiempo de espera, permitiendo transicionar pedidos a preparación (*EN_COCINA*), despacho (*EN_CAMINO*) o entrega (*ENTREGADO*).
- **Para el Administrador y Gerencia:** Panel integral con métricas en vivo (ventas brutas, ticket promedio, distribución por método de pago, stock activo), control de inventario de platos/categorías y auditoría histórica completa de usuarios y órdenes.

### Estructura del documento
Este informe académico documenta el estado del arte del proyecto para el hito **APF2 (Semana 14)**. Se encuentra dividido en tres grandes bloques:
1. **Aspectos Generales:** Definición del problema, justificación, objetivos, alcance, reglas de negocio y KPIs.
2. **Marco Teórico:** Arquitecturas de software empleadas, fundamentos de seguridad web y justificación tecnológica comparativa.
3. **Desarrollo de la Solución:** Requerimientos (RF y RNF), casos de uso, diagrama entidad-relación, arquitectura C4, contratos de API, autenticación profunda basada en JSON Web Tokens (JWT), front-end reactivo con Angular Signals, backend modular en Spring Boot, WebSockets STOMP, infraestructura multi-nube con Docker, pruebas unitarias automatizadas y el estado de la gestión ágil mediante gráficos Burndown.

---

# CAPÍTULO 1 · ASPECTOS GENERALES

## 1.1 Definición del problema

### 1.1.1 Descripción del problema

#### Situación actual
El restaurante "Brasas & Wok" opera en un entorno híbrido donde los pedidos presenciales compiten con solicitudes telefónicas y mensajes de WhatsApp. La captura de pedidos recae en personal que debe transcribir manualmente cada solicitud en comandas de papel y llevarlas físicamente al área de brasas o al área de woks. 

#### Dolencias del usuario (Pain Points)
1. **Pérdida y desorden de comandas:** En horarios de alta congestión (almuerzos y cenas de fines de semana), las órdenes en papel suelen traspapelarse, mancharse con grasa o procesarse fuera de orden cronológico (*FIFO - First In, First Out*).
2. **Tiempos de espera prolongados e incertidumbre:** El cliente no tiene certeza de si su plato ya entró a cocción, si el motorizado ya salió o cuánto tiempo tardará su entrega. Esto genera constantes llamadas de reclamo que saturan la línea telefónica.
3. **Falta de visibilidad de inventario:** Cuando se agota un insumo crítico (como una guarnición o un corte de carne específico), la cocina tarda en notificar a la caja, provocando que se vendan productos no disponibles que luego deben ser cancelados o modificados ante el cliente.
4. **Vulnerabilidad en la gestión de credenciales y datos:** Muchos sistemas tradicionales guardan datos en texto plano o usan sesiones frágiles basadas en cookies sin protección CSRF/XSS, exponiendo información de clientes.

#### Oportunidad de mejora
La implementación de una plataforma web construida sobre una arquitectura SPA (*Single Page Application*) con Angular 19 y una API REST robusta en Spring Boot con WebSockets STOMP permite erradicar el uso del papel, sincronizar la cocina con el salón y delivery en menos de 200 milisegundos, y ofrecer al cliente una experiencia digital transparente con seguridad criptográfica de grado bancario.

## 1.2 Definición de objetivos

### 1.2.1 Objetivo general
Desarrollar e implementar un sistema web full stack escalable, desacoplado y seguro para el restaurante fusión "Brasas & Wok", que centralice el catálogo gastronómico, automatice la toma y pago simulado de pedidos de delivery, optimice los flujos de cocina mediante un sistema KDS en tiempo real y proporcione reportería analítica a la administración para la toma de decisiones.

### 1.2.2 Objetivos específicos
1. **Diseñar e implementar una arquitectura de backend en Spring Boot (Java 21)** estructurada en capas, con persistencia relacional en MySQL 8.4 alojada en la nube (Aiven Cloud) y seguridad basada en Spring Security 6 con JWT (JSON Web Tokens).
2. **Construir una interfaz de usuario moderna y responsiva en Angular 19** basada en componentes autónomos (*Standalone Components*), gestión de estado reactiva con *Angular Signals* y diseño estético mobile-first optimizado con Tailwind CSS.
3. **Implementar un canal de comunicación bidireccional en tiempo real con WebSockets y STOMP** para notificar instantáneamente a cocina ante nuevos pedidos y a los clientes sobre cambios en el estado de su orden.
4. **Desplegar la infraestructura productiva mediante contenedores Docker y plataformas PaaS líderes en la nube**, alojando el Frontend en Vercel, el Backend en Render y la Base de Datos en Aiven Cloud, asegurando disponibilidad mediante comprobaciones de salud (*Health Checks*).
5. **Validar la estabilidad funcional del software mediante una batería de pruebas automatizadas con JUnit 5 y Mockito**, garantizando cobertura en los servicios centrales de órdenes, pagos y seguridad.

### 1.2.3 Alcances y limitaciones

#### Alcances funcionales (MVP - Minimum Viable Product)
- **Módulo de Autenticación y Autorización:** Registro de clientes, inicio de sesión seguro, emisión y validación de tokens JWT con roles (`ROLE_CUSTOMER` y `ROLE_ADMIN`), cierre de sesión e interceptores de peticiones.
- **Módulo de Catálogo Gastronómico:** Navegación por categorías (*Brasas & Pollos, Wok & Salteados, Chaufas & Aeropuertos, Entradas & Piques, Bebidas*), visualización detallada de platos, precios, descripciones e imágenes optimizadas.
- **Módulo de Carrito de Compras Reactivo:** Adición, modificación de cantidades, notas especiales por plato (ej. "sin cebolla"), cálculo reactivo de subtotal, costo de envío y monto final con Signals.
- **Módulo de Checkout y Simulación de Pago:** Formulario con precarga de datos de cliente, validación de dirección y teléfono, y soporte para 4 modalidades de pago: Tarjeta de crédito/débito, Billetera digital (Yape/Plin), Efectivo y Transferencia bancaria.
- **Módulo de Cocina KDS (Kitchen Display System):** Tablero administrativo en tiempo real con actualización automática de tickets, cronómetro de preparación y control de transición de estados (*PENDIENTE -> EN_COCINA -> EN_CAMINO -> ENTREGADO*).
- **Módulo de Trazabilidad para el Cliente ("Mis Pedidos"):** Historial detallado de compras del usuario autenticado y línea de tiempo visual con los hitos de entrega.
- **Módulo Administrativo:** CRUD de productos, categorías, administración de órdenes y panel de métricas con indicadores clave de ventas.

#### Alcances no funcionales
- **Seguridad en tránsito obligatoria:** Comunicación exclusiva sobre HTTPS y WebSockets seguros (WSS).
- **Cifrado de datos:** Contraseñas hasheadas en base de datos mediante algoritmo BCrypt con salt dinámico de 10 rondas.
- **Desacoplamiento total:** Comunicación cliente-servidor 100% mediante JSON sobre endpoints RESTful independientes.
- **Responsividad:** Adaptabilidad a dispositivos móviles (smartphones), tabletas, laptops y monitores industriales de cocina.
- **Tiempos de respuesta:** Respuestas de API inferiores a 300 ms en condiciones normales de red.

#### Fuera de alcance (por tiempo y recursos para la versión académica)
- Integración real con pasarelas de pago transaccionales que requieran RUC de persona jurídica (como Culqi o Niubiz en modo producción con dinero real).
- Integración con el sistema de facturación electrónica SUNAT (envío de XML a OSE/PSE).
- Geolocalización de motorizados por GPS en mapa interactivo en vivo.

## 1.3 Stakeholders y público objetivo

### Mapa de actores
```mermaid
flowchart TD
    ActorComensal["Cliente Comensal\n(Web / Móvil)"]
    ActorAdmin["Administrador\n(Gerencia)"]
    ActorCocina["Personal de Cocina\n(Área de Woks y Brasas)"]
    Sistema["Plataforma Brasas & Wok"]
    
    ActorComensal -->|Explora carta, compra y rastrea pedido| Sistema
    ActorAdmin -->|Gestiona platos, precios y analiza ventas| Sistema
    ActorCocina -->|Recibe comandas y actualiza estados en KDS| Sistema
```

### Perfiles de usuario y necesidades
| Rol / Actor | Descripción | Necesidad Principal | Dispositivo Principal |
| :--- | :--- | :--- | :--- |
| **Cliente (`ROLE_CUSTOMER`)** | Comensal urbano de 18 a 55 años que desea ordenar comida a domicilio rápida y de calidad. | Navegar un menú claro, ordenar en menos de 2 minutos y saber el estado exacto de su comida. | Smartphone / Navegador Móvil |
| **Administrador (`ROLE_ADMIN`)** | Gerente o dueño del establecimiento a cargo de la rentabilidad y control del menú. | Supervisar ingresos, cambiar precios o imágenes al instante y auditar anomalías. | Laptop / Computadora de Escritorio |
| **Operador de Cocina (`ROLE_ADMIN` / Staff)** | Jefe de cocina y cocineros en estaciones de brasas y woks. | Visualizar las comandas que van entrando sin papel y marcar los platos listos rápidamente. | Tablet / Pantalla Táctil de Cocina |

## 1.4 Reglas de negocio
- **RN-01 (Exclusividad de Rol en Comandas):** Solo los usuarios con rol `ROLE_CUSTOMER` pueden emitir pedidos de delivery para consumo personal. El rol `ROLE_ADMIN` tiene restringida la compra directa para evitar distorsiones en las métricas contables del restaurante.
- **RN-02 (Transición de Estados y Control de Flujo):** Una comanda solo puede seguir un flujo coherente: `PENDIENTE -> EN_COCINA -> EN_CAMINO -> ENTREGADO`. Únicamente un pedido en estado `PENDIENTE` puede ser cancelado por el cliente. Ante errores humanos del personal de cocina, se permite retornar de `EN_CAMINO` a `EN_COCINA` bajo registro de auditoría.
- **RN-03 (Trazabilidad Inmutable de Auditoría):** Cada cambio de estado genera un registro inmutable en la tabla `order_status_logs`, almacenando el estado anterior, el nuevo estado, la fecha exacta (*timestamp*) y comentarios de cocina.
- **RN-04 (Vigencia de Tokens y Sesión):** Las credenciales de acceso se emiten en un token JWT con vigencia máxima de 24 horas (86,400,000 milisegundos). Al expirar, las rutas protegidas retornarán HTTP 401 y el cliente será redirigido al formulario de ingreso.
- **RN-05 (Integridad de Carrito y Precios):** Los precios de los productos en el carrito se revalidan en el backend al momento de invocar el endpoint de creación de orden, evitando manipulaciones maliciosas de precios en el cliente.

## 1.5 Métricas de éxito (KPI)
1. **Order Cycle Time (Tiempo de Ciclo de Pedido):** Reducción del tiempo transcurrido desde que el comensal confirma el pago hasta que el plato sale a despacho, fijando una meta de $\le 25\text{ minutos}$ en promedio.
2. **Kitchen Response Latency (Latencia de Notificación a Cocina):** Tiempo en milisegundos que tarda la comanda en aparecer en la pantalla KDS tras la confirmación. Meta: $\le 200\text{ ms}$ mediante WebSockets.
3. **Cart Abandonment Rate (Tasa de Abandono de Carrito):** Porcentaje de carritos con productos que no concluyen en checkout. Meta objetivo: $< 20\%$, gracias a un flujo de checkout simplificado en una sola ventana modal.
4. **Uptime del Sistema (Disponibilidad):** Disponibilidad del servicio en producción $\ge 99.5\%$, monitoreada de forma continua mediante sondas de salud cada 10 minutos con UptimeRobot.

---

# CAPÍTULO 2 · MARCO TEÓRICO

## 2.1 Antecedentes y Benchmark

### Soluciones existentes y estado del arte
En la actualidad, las grandes cadenas de comida rápida implementan soluciones omnicanal apoyadas en microservicios o arquitecturas desacopladas con comunicación asíncrona. Sin embargo, los restaurantes medianos o en crecimiento enfrentan la disyuntiva de pagar altas comisiones en aplicaciones agregadoras o utilizar sistemas de punto de venta (POS) locales cerrados que carecen de una tienda online moderna orientada al cliente.

### Benchmark comparativo
| Criterio | Pardos Chicken Web | Apps Agregadoras (PedidosYa / Rappi) | **Brasas & Wok (Nuestra Solución)** |
| :--- | :--- | :--- | :--- |
| **Comisión por Venta** | 0% (Canal propio) | 18% - 30% del ticket bruto | **0% (Canal 100% propio del negocio)** |
| **Trazabilidad en Vivo** | Parcial (SMS o recarga) | Notificaciones Push por app nativa | **WebSockets bidireccionales en navegador web sin instalar apps** |
| **Integración KDS de Cocina** | Privativo y costoso | No incluye KDS directo (usa tablet genérica) | **KDS interactivo web incluido nativamente** |
| **Tiempo de Carga Inicial** | Regular (~3.5 s) | Depende de la descarga de app (80MB+) | **Ultra-ligero (<1.5 s en Vercel Edge Network)** |
| **Arquitectura de Software** | Monolito tradicional | Microservicios distribuidos complejos | **Arquitectura Full Stack Desacoplada (Angular + Spring Boot)** |

## 2.2 Fundamento teórico

### Arquitectura web en capas (Layered Architecture)
El patrón en capas organiza la aplicación en niveles de abstracción jerárquicos donde cada capa ofrece servicios a la superior y consume los de la inferior:
1. **Capa de Presentación (Frontend SPA):** Construida en Angular 19, maneja la experiencia visual, validaciones de interfaz y despacho de peticiones HTTP.
2. **Capa de Controladores (REST Controllers):** En Spring Boot, expone los endpoints de la API, valida los esquemas de entrada (`@Valid`), gestiona los códigos de respuesta HTTP y delega la ejecución a los servicios.
3. **Capa de Lógica de Negocio (Service Layer):** Implementa las reglas de negocio, transaccionalidad (`@Transactional`), orquestación de pagos y emisión de eventos WebSocket.
4. **Capa de Acceso a Datos (Data Access / Repository Layer):** Mediante Spring Data JPA y Hibernate, traduce las consultas de alto nivel a sentencias SQL eficientes para MySQL.

### Principios REST y convenciones JSON
Una API REST (*Representational State Transfer*) aprovecha los métodos estándar del protocolo HTTP para modelar acciones sobre recursos identificables mediante URIs:
- `GET`: Obtención idempotente de datos (ej. `/api/products`).
- `POST`: Creación de recursos (ej. `/api/orders`).
- `PUT`: Actualización completa o idempotente de un recurso (ej. `/api/products/{id}`).
- `PATCH`: Modificación parcial de un recurso (ej. `/api/admin/orders/{id}/status`).
- `DELETE`: Eliminación o baja lógica de un recurso (ej. `/api/products/{id}`).

### Fundamentos de seguridad web
- **Hashing Criptográfico de Contraseñas:** Las contraseñas nunca deben almacenarse en texto plano. Se emplea **BCrypt**, una función de derivación de claves basada en el cifrado Blowfish que incorpora un *salt* aleatorio dinámico de 128 bits y factor de costo adaptable para neutralizar ataques de diccionario y *rainbow tables*.
- **CORS (Cross-Origin Resource Sharing):** Mecanismo de seguridad de los navegadores que restringe las peticiones HTTP entre orígenes distintos. El backend de Spring Boot se configuró para autorizar explícitamente a los dominios del frontend (`https://*.vercel.app` y `http://localhost:4200`).
- **Sanitización y Parámetros Vinculados:** Uso de consultas parametrizadas vía JPA/Hibernate que inmunizan a la base de datos frente a ataques de inyección SQL (SQLi).

### Autenticación y Autorización basada en Tokens (JWT)
El estándar abierto **JSON Web Token (RFC 7519)** permite transmitir afirmaciones (*claims*) de forma compacta y autónoma entre las partes como un objeto JSON. Al ser *stateless* (sin estado en el servidor), el backend no requiere almacenar sesiones en memoria RAM ni en base de datos, lo que permite una escalabilidad horizontal ilimitada.

### Comunicación en tiempo real con WebSockets y STOMP
El protocolo HTTP tradicional se basa en el modelo petición-respuesta unidireccional iniciado por el cliente. Para sistemas como el KDS de cocina, consultar el servidor cada pocos segundos (*HTTP Polling*) genera sobrecarga innecesaria en la red y el CPU. 
**WebSocket (RFC 6455)** establece una conexión TCP persistente, bidireccional y de baja latencia a través de un único canal dúplex. Sobre esta conexión, se utiliza **STOMP** (*Simple Text Oriented Messaging Protocol*), que define un patrón de mensajería Publicador/Suscriptor (*Pub/Sub*) con destinos como `/topic/admin` y `/topic/orders/{id}/status`.

## 2.3 Tecnologías seleccionadas y justificación

```mermaid
graph LR
    subgraph Frontend ["Frontend (Vercel)"]
        Angular["Angular 19\n(Standalone & Signals)"]
        Tailwind["Tailwind CSS 3\n(Diseño Gastronómico)"]
        StompJS["@stomp/stompjs\n(WebSockets)"]
    end

    subgraph Backend ["Backend (Render - Docker)"]
        SpringBoot["Spring Boot 4 / Java 21\n(REST API & WebSockets)"]
        SpringSec["Spring Security 6\n(JWT HMAC-SHA256)"]
        Hibernate["Spring Data JPA\n(Hibernate ORM)"]
    end

    subgraph Database ["Base de Datos (Aiven Cloud)"]
        MySQL["MySQL 8.4 LTS\n(SSL Required & HikariCP)"]
    end

    Frontend -->|HTTPS REST JSON & WSS| Backend
    Backend -->|JDBC SSL / TLS 1.3| Database
```

- **Frontend — Angular 19:** Se seleccionó por su arquitectura robusta, tipado estricto con TypeScript, su nuevo sistema reactivo de **Signals** (que optimiza el renderizado del DOM sin necesidad de la pesada librería Zone.js clásica) y la modularidad de sus *Standalone Components*.
- **Diseño — Tailwind CSS:** Framework de utilidades CSS de bajo nivel que permite construir interfaces altamente personalizadas, responsivas y con tamaño de bundle mínimo en producción mediante purgado de clases.
- **Backend — Java 21 LTS & Spring Boot:** Plataforma empresarial líder con recolección de basura moderna, soporte para hilos virtuales y un ecosistema maduro que garantiza transaccionalidad, inyección de dependencias y seguridad declarativa con anotaciones (`@PreAuthorize`).
- **Base de Datos — MySQL 8.4 en Aiven Cloud:** Motor relacional con soporte transaccional ACID (*Atomicidad, Consistencia, Aislamiento, Durabilidad*), con replicación y backups automáticos en la nube gestionada de Aiven con cifrado SSL/TLS obligatorio.
- **Infraestructura de Despliegue:** 
  - **Vercel:** Despliegue de la aplicación estática Angular sobre redes CDN mundiales (*Edge Delivery*) con certificado SSL automático y compresión Brotli/Gzip.
  - **Render:** Despliegue del backend encapsulado en una imagen Docker multi-etapa con Java 21 JRE ultraligero y políticas de puertos dinámicos.

---

# CAPÍTULO 3 · DESARROLLO DE LA SOLUCIÓN

## 3.1 Requerimientos

### 3.1.1 Requerimientos funcionales (RF)
| Código | Módulo | Actor Principal | Descripción Detallada | Criterio de Aceptación |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Autenticación | Usuario Anónimo | Permitir el registro de nuevos usuarios clientes ingresando nombre completo, correo, teléfono, dirección, usuario y contraseña. | El sistema valida que el correo y nombre de usuario no existan; almacena la contraseña hasheada con BCrypt y retorna HTTP 201 Created. |
| **RF-02** | Autenticación | Usuario Registrado | Permitir el inicio de sesión validando credenciales contra la base de datos. | Si las credenciales son válidas, emite un token JWT con vigencia de 24h, datos de perfil y rol de usuario. Retorna HTTP 200 OK. |
| **RF-03** | Catálogo | Todos | Consultar y listar las categorías culinarias activas del restaurante. | Retorna arreglo JSON con id, nombre, slug, descripción e imagen representativa. |
| **RF-04** | Catálogo | Todos | Consultar los platos y productos disponibles, filtrados por categoría o búsqueda de texto. | Lista reactiva de platos con precio en Soles (S/), ingredientes, disponibilidad e imagen. |
| **RF-05** | Carrito | Cliente | Permitir agregar platos al carrito de compra, ajustar cantidades y añadir notas culinarias especiales. | Las Signals reactivas recalculan instantáneamente el subtotal, costo de envío fijo y total general. |
| **RF-06** | Pedidos | Cliente Autenticado | Confirmar y emitir una comanda de delivery indicando dirección, teléfono de contacto y método de pago. | Crea la orden en estado `PENDIENTE`, asigna número correlativo único (ej. `ORD-1727823901`) y notifica por WebSocket a cocina. |
| **RF-07** | Pagos | Cliente | Simular el procesamiento del pago (Tarjeta, Yape/Plin, Efectivo, Transferencia). | Registra la transacción con estado `COMPLETED`, genera código de referencia (ej. `CARD-4242`) y asocia el pago a la orden. |
| **RF-08** | Trazabilidad | Cliente | Consultar el historial de comandas propias del cliente en la vista "Mis Pedidos". | Muestra lista ordenada descendentemente por fecha con estados, ítems y montos. |
| **RF-09** | KDS Cocina | Personal Cocina / Admin | Visualizar en tiempo real los pedidos entrantes en una pantalla táctil sin recargar el navegador. | Conexión WebSocket a `/topic/admin` que añade el nuevo ticket al tablero inmediatamente. |
| **RF-10** | KDS Cocina | Personal Cocina / Admin | Avanzar o retroceder el estado de una comanda (`PENDIENTE -> EN_COCINA -> EN_CAMINO -> ENTREGADO`). | Emite notificación WebSocket al cliente en `/topic/orders/{id}/status` y registra log de auditoría. |
| **RF-11** | Cancelación | Cliente | Cancelar un pedido propio siempre que este se encuentre en estado `PENDIENTE`. | Cambia el estado a `CANCELADO`, notifica a cocina y deshabilita cancelaciones si ya está en preparación. |
| **RF-12** | Gestión Menú | Administrador | Crear, editar o dar de baja lógica platos del menú e interactuar con subida de imágenes. | Operación protegida por `ROLE_ADMIN`; guarda la imagen en el servidor y actualiza la entidad. |
| **RF-13** | Gestión Categorías| Administrador | Crear y organizar las categorías y el orden de visualización en la carta. | Actualización en tiempo real protegida por `ROLE_ADMIN`. |
| **RF-14** | Dashboard | Administrador | Visualizar indicadores gerenciales: ventas totales, ticket promedio, cantidad de órdenes y pedidos activos. | Endpoint `/api/admin/dashboard/stats` calcula resúmenes financieros en base a la base de datos. |

### 3.1.2 Requerimientos no funcionales (RNF)
- **RNF-01 (Seguridad en Tránsito y Reposo):** Todas las comunicaciones entre cliente y servidor se canalizan obligatoriamente sobre TLS/HTTPS y WSS. Las contraseñas en MySQL están cifradas irreversiblemente con BCrypt. El token JWT está firmado con algoritmo simétrico HMAC-SHA256 usando una llave de alta entropía de 256 bits.
- **RNF-02 (Rendimiento y Latencia):** El tiempo de respuesta de los endpoints de lectura debe ser inferior a 250 ms. La propagación de eventos WebSocket entre el backend y los clientes conectados no debe superar los 200 ms.
- **RNF-03 (Usabilidad y Responsive Design):** La interfaz web debe adaptarse fluidamente a pantallas desde 320 px de ancho (smartphones compactos) hasta 4K, cumpliendo con una jerarquía visual limpia y libre de elementos distractores.
- **RNF-04 (Disponibilidad y Concurrencia):** El sistema debe soportar un mínimo de 100 usuarios concurrentes sin degradación de servicio y contar con monitores de actividad para evitar el apagado de instancias gratuitas.
- **RNF-05 (Mantenibilidad y Clean Code):** El código debe estructurarse bajo principios SOLID, con estricta separación de responsabilidades, tipado TypeScript estricto en frontend y desacoplamiento de DTOs respecto a las entidades JPA en backend.

## 3.2 Casos de uso

### Diagrama general de casos de uso
```mermaid
flowchart TD
    Cliente((Cliente\nComensal))
    Admin((Administrador /\nPersonal Cocina))

    subgraph Plataforma_Brasas_Wok ["Plataforma Brasas & Wok"]
        CU01["CU-01: Registrarse / Iniciar Sesión"]
        CU02["CU-02: Explorar Carta Gastronómica"]
        CU03["CU-03: Gestionar Carrito de Compras"]
        CU04["CU-04: Realizar Pedido y Simular Pago"]
        CU05["CU-05: Rastrear Pedido en Tiempo Real"]
        CU06["CU-06: Cancelar Pedido Pendiente"]
        CU07["CU-07: Monitorear Comandas en KDS (Cocina)"]
        CU08["CU-08: Actualizar Estado de Comanda"]
        CU09["CU-09: Administrar Productos y Categorías"]
        CU10["CU-10: Consultar Métricas del Dashboard"]
    end

    Cliente --> CU01
    Cliente --> CU02
    Cliente --> CU03
    Cliente --> CU04
    Cliente --> CU05
    Cliente --> CU06

    Admin --> CU01
    Admin --> CU07
    Admin --> CU08
    Admin --> CU09
    Admin --> CU10
```

### Especificación de casos de uso críticos

#### Caso de Uso CU-04: Realizar Pedido y Simular Pago
- **Actor Principal:** Cliente autenticado (`ROLE_CUSTOMER`).
- **Precondiciones:**
  1. El cliente debe haber iniciado sesión (poseer un JWT válido).
  2. El carrito de compras debe contener al menos un producto con cantidad $\ge 1$.
- **Flujo Principal:**
  1. El cliente hace clic en el botón "Finalizar Pedido" desde el Drawer del Carrito.
  2. El sistema despliega el modal de Checkout con la dirección y teléfono precargados del perfil.
  3. El cliente verifica su información, añade notas para el repartidor y selecciona el método de pago (Tarjeta, Yape/Plin, Efectivo o Transferencia).
  4. El cliente confirma la transacción presionando "Pagar y Enviar Comanda".
  5. El frontend envía una petición `POST /api/orders` con la cabecera `Authorization: Bearer <token>`.
  6. El backend valida el token, verifica la disponibilidad de platos, crea la orden en estado `PENDIENTE` y guarda los ítems en base de datos.
  7. El backend emite el evento WebSocket a `/topic/admin` para que la comanda aparezca de inmediato en la cocina.
  8. El frontend procede a enviar la petición `POST /api/payments/process` vinculando el ID de orden y el monto total.
  9. El backend registra el pago simulado como `COMPLETED`.
  10. El frontend recibe confirmación exitosa, vacía el carrito, muestra el número de orden asignado (ej. `ORD-849201`) y permite al usuario ir a "Mis Pedidos".
- **Flujos Alternos:**
  - *4a. Token expirado (HTTP 401):* El interceptor de Angular captura el error, cierra la sesión local y abre el modal de login informando la expiración.
  - *4b. Usuario con rol Administrador (RN-01):* El sistema bloquea el checkout e informa que los administradores no pueden generar comandas de delivery.
- **Postcondiciones:** La orden queda almacenada en la base de datos `brasas_wok_db`, el personal de cocina visualiza el ticket en su monitor y el stock se actualiza.

#### Caso de Uso CU-08: Actualizar Estado de Comanda en Cocina (KDS)
- **Actor Principal:** Personal de Cocina / Administrador (`ROLE_ADMIN`).
- **Precondiciones:** La comanda debe estar registrada en el sistema y visible en el tablero KDS.
- **Flujo Principal:**
  1. El cocinero visualiza un ticket en estado `PENDIENTE` y hace clic en "Preparar".
  2. El frontend administrativo envía una petición `PATCH /api/admin/orders/{id}/status` con el nuevo estado `EN_COCINA`.
  3. El backend verifica que el usuario cuente con rol `ROLE_ADMIN`.
  4. El servicio `OrderServiceImpl` actualiza la comanda, genera un registro en `order_status_logs` y persiste los cambios.
  5. El servicio `OrderStatusNotificationService` envía un mensaje WebSocket a `/topic/orders/{id}/status` con el nuevo estado.
  6. La pantalla del cliente que está rastreando el pedido actualiza automáticamente su línea de tiempo visual sin recargar la página.
- **Flujo Alterno:** Si el cocinero marcó por error `EN_CAMINO` cuando el plato aún estaba en mesa, presiona el botón de retroceso a `EN_COCINA`; el sistema registra el movimiento y notifica la corrección en tiempo real.

## 3.3 Modelo de datos

### Diagrama Entidad-Relación (Relacional MySQL)
```mermaid
erDiagram
    USERS ||--o{ ORDERS : "cliente realiza (1:N)"
    CATEGORIES ||--o{ PRODUCTS : "clasifica (1:N)"
    ORDERS ||--|{ ORDER_ITEMS : "contiene (1:N)"
    PRODUCTS ||--o{ ORDER_ITEMS : "referenciado en (1:N)"
    ORDERS ||--|| PAYMENTS : "se liquida con (1:1)"
    ORDERS ||--o{ ORDER_STATUS_LOGS : "audita historial (1:N)"

    USERS {
        bigint id PK
        varchar username UK "Nombre de usuario unico"
        varchar email UK "Correo electronico unico"
        varchar password "Hash BCrypt de 60 caracteres"
        varchar full_name "Nombre completo del usuario"
        varchar phone "Telefono de contacto"
        varchar address "Direccion predeterminada"
        varchar role "ROLE_CUSTOMER o ROLE_ADMIN"
        boolean is_active "Estado logico del usuario"
        datetime created_at "Fecha de creacion"
        datetime updated_at "Fecha de modificacion"
    }

    CATEGORIES {
        bigint id PK
        varchar name "Nombre de la categoria"
        varchar slug UK "Identificador URL amigable"
        varchar description "Breve resena de la categoria"
        varchar image_url "Enlace a imagen de cabecera"
        int display_order "Orden visual en la carta"
        boolean is_active "Disponibilidad"
    }

    PRODUCTS {
        bigint id PK
        bigint category_id FK "Relacion con categoria"
        varchar name "Nombre del plato o bebida"
        varchar slug UK "Identificador URL amigable"
        text description "Ingredientes y preparacion"
        decimal price "Precio de venta en Soles"
        varchar image_url "Foto del producto"
        boolean is_available "Stock activo"
        boolean is_featured "Destacado en portada"
        int preparation_time "Minutos estimados de coccion"
    }

    ORDERS {
        bigint id PK
        varchar order_number UK "Correlativo de orden"
        bigint customer_id FK "Relacion con usuario"
        varchar status "PENDIENTE, EN_COCINA, EN_CAMINO, ENTREGADO, CANCELADO"
        varchar payment_method "TARJETA, YAPE_PLIN, EFECTIVO, TRANSFERENCIA"
        varchar delivery_address "Direccion de envio"
        varchar delivery_phone "Telefono de contacto para entrega"
        text delivery_notes "Indicaciones adicionales"
        decimal subtotal "Suma de subtotales de items"
        decimal delivery_fee "Costo de envio fijo"
        decimal total_amount "Monto total a pagar"
        datetime created_at "Momento de emision"
        datetime updated_at "Ultima actualizacion"
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK "Orden a la que pertenece"
        bigint product_id FK "Plato ordenado"
        varchar product_name "Nombre historico del plato"
        decimal unit_price "Precio historico unitario"
        int quantity "Cantidad solicitada"
        decimal subtotal "Precio x Cantidad"
        varchar notes "Personalizacion culinaria"
    }

    PAYMENTS {
        bigint id PK
        bigint order_id FK, UK "Orden liquidada"
        varchar payment_method "Metodo empleado"
        decimal amount "Monto total procesado"
        varchar status "COMPLETED, PENDING, FAILED"
        varchar transaction_reference "Identificador de transaccion simulada"
        datetime created_at "Fecha de liquidacion"
    }

    ORDER_STATUS_LOGS {
        bigint id PK
        bigint order_id FK "Comanda auditada"
        varchar previous_status "Estado de origen"
        varchar new_status "Estado de destino"
        varchar comment "Motivo o comentario de cocina"
        datetime created_at "Fecha y hora del cambio"
    }
```

### Migraciones y estrategia de Seed inicial
- **Hibernate DDL Auto (`spring.jpa.hibernate.ddl-auto=update`):** En el archivo `application.properties`, Hibernate inspecciona la estructura de las entidades Java decoradas con `@Entity` y genera o actualiza automáticamente las tablas relacionales en la base de datos `brasas_wok_db` de Aiven Cloud sin pérdida de datos.
- **Poblado Automático (`DataInitializer.java`):** Componente de arranque (`CommandLineRunner`) que verifica si existen datos; de encontrarse vacía la base de datos, inserta automáticamente el usuario administrador inicial (`admin@brasaswok.pe` con contraseña encriptada `admin123`), las 5 categorías oficiales y los platos insignia con descripciones y precios.

## 3.4 Arquitectura de software

### Diagrama C4 — Nivel 1: Contexto del Sistema
```mermaid
flowchart TD
    Cliente["Comensal (Cliente)"]
    AdminUser["Administrador / Cocinero"]
    
    subgraph SistemaBrasasWok ["Sistema Brasas & Wok"]
        App["Plataforma Web Full Stack\n(Catálogo, Pedidos, KDS, Pagos)"]
    end
    
    CloudStorage["Almacenamiento Cloud / CDN\n(Imágenes y multimedia)"]
    AivenMySQL["Aiven Cloud MySQL 8.4\n(Base de Datos Relacional)"]

    Cliente -->|Navega catálogo, compra y monitorea| App
    AdminUser -->|Administra menú, cocina y dashboard| App
    App -->|Almacena y consulta datos con SSL| AivenMySQL
    App -->|Carga assets estáticos| CloudStorage
```

### Diagrama C4 — Nivel 2: Contenedores
```mermaid
flowchart TD
    subgraph NavegadorCliente ["Navegador Web del Usuario"]
        SPA["Frontend SPA\n(Angular 19, Tailwind, Signals)\nAlojado en Vercel"]
    end

    subgraph ServidorNube ["Servidor en la Nube (Render.com)"]
        Docker["Contenedor Docker (Linux)\nEclipse Temurin JRE 21"]
        API["Backend REST API + STOMP WebSocket\n(Spring Boot 4 / Spring Security 6)"]
        Docker --> API
    end

    subgraph BaseDatosNube ["Aiven Cloud Database"]
        MySQLInstance[("MySQL 8.4 Database\nbrasas_wok_db\n(Puerto 21487 con SSL Obligatorio)")]
    end

    SPA -->|HTTPS: Peticiones REST JSON con JWT| API
    SPA <-->|WSS: Protocolo STOMP bidireccional| API
    API -->|JDBC Connection Pool HikariCP con TLS| MySQLInstance
```

### Diagrama C4 — Nivel 3: Componentes del Backend
```mermaid
flowchart TD
    Request["Petición HTTP Entrante\n(Con Header Authorization: Bearer JWT)"] --> JwtFilter["JwtAuthenticationFilter\n(Intercepta y valida firma)"]
    JwtFilter --> SecurityContext["SecurityContextHolder\n(Establece autenticación y roles)"]
    SecurityContext --> Controller["REST Controllers\n(AuthController, OrderController, etc.)"]
    Controller --> Validation["Jakarta Validation\n(@Valid en DTOs)"]
    Validation --> Service["Service Layer\n(AuthService, OrderService, etc.)"]
    Service --> WSNotification["OrderStatusNotificationService\n(SimpMessagingTemplate)"]
    Service --> Repo["Spring Data JPA Repositories\n(UserRepository, OrderRepository, etc.)"]
    Repo --> Entity["JPA Entities & Hibernate\n(Mapeo Relacional)"]
```

## 3.5 Contratos de API

El backend sigue las directrices OpenAPI 3.0 / REST. Todos los cuerpos de solicitud y respuesta utilizan formato JSON con codificación UTF-8.

### Convención estándar de errores (`ErrorResponse`)
Cuando una petición falla, el servidor captura la excepción en `GlobalExceptionHandler` y retorna un payload homogéneo:
```json
{
  "timestamp": "2026-11-07T20:30:00.125Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Username is already taken",
  "path": "/api/auth/register",
  "details": null
}
```

### Tabla de Endpoints Principales del Sistema
| Método | Endpoint | Acceso / Rol | Descripción | Payload Request | Respuesta Exitosa |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra un nuevo comensal | `RegisterRequest` | `201 Created` (`MessageResponse`) |
| `POST` | `/api/auth/login` | Público | Autentica usuario y emite JWT | `LoginRequest` | `200 OK` (`AuthResponse` con token) |
| `GET` | `/api/auth/me` | Autenticado | Obtiene datos del usuario en sesión | Ninguno | `200 OK` (`UserDetailsImpl`) |
| `GET` | `/api/categories` | Público | Lista categorías activas del menú | Query params opcionales | `200 OK` (`List<CategoryResponse>`) |
| `GET` | `/api/products` | Público | Lista platos del menú (con filtro opcional) | `?category=slug` | `200 OK` (`List<ProductResponse>`) |
| `POST` | `/api/orders` | `ROLE_CUSTOMER` | Crea una comanda de delivery | `OrderCreateRequest` | `201 Created` (`OrderResponse`) |
| `GET` | `/api/orders/my-orders` | `ROLE_CUSTOMER` | Historial de compras del cliente | Ninguno | `200 OK` (`List<OrderResponse>`) |
| `GET` | `/api/orders/track/{num}` | Público | Consulta el estado de un ticket por código | Path param | `200 OK` (`OrderResponse`) |
| `PUT` | `/api/orders/{id}/cancel` | `ROLE_CUSTOMER` | Cancela comanda si está pendiente | JSON con motivo opcional | `200 OK` (`OrderResponse`) |
| `POST` | `/api/payments/process` | `ROLE_CUSTOMER` | Procesa pago simulado de una orden | `PaymentRequest` | `200 OK` (`PaymentResponse`) |
| `GET` | `/api/admin/orders` | `ROLE_ADMIN` | Obtiene comandas para KDS y control | `?status=EN_COCINA` | `200 OK` (`List<AdminOrder>`) |
| `PATCH` | `/api/admin/orders/{id}/status` | `ROLE_ADMIN` | Actualiza estado de pedido en cocina | `OrderStatusUpdateRequest` | `200 OK` (`OrderResponse`) |
| `GET` | `/api/admin/dashboard/stats` | `ROLE_ADMIN` | Reportería y métricas consolidadas | Ninguno | `200 OK` (`DashboardStatsResponse`)|
| `GET` | `/api/health` | Público | Comprobación de salud para monitores | Ninguno | `200 OK` (`{"status": "UP"}`) |

---

## 3.6 Autenticación y Autorización

### 3.6.1 Fundamentos de Seguridad, HTTPS y Manejo de Información Sensible

#### Cifrado en Tránsito Obligatorio (HTTPS y TLS 1.3)
La autenticación basada en tokens tipo *Bearer* exige el uso riguroso del protocolo **HTTPS (HyperText Transfer Protocol Secure)**. 
Bajo HTTPS, toda la comunicación viaja cifrada mediante algoritmos de clave asimétrica y simétrica (TLS 1.2 / TLS 1.3). Esto impide que un atacante en la misma red Wi-Fi o mediante ataques *Man-in-the-Middle (MitM)* pueda espiar las cabeceras HTTP y clonar el token de sesión o interceptar las contraseñas enviadas en el cuerpo del login.

#### Por qué el Payload del JWT NUNCA debe contener información sensible sin cifrar
Un error común y peligroso en el desarrollo web es suponer que un JSON Web Token (JWT) es un mecanismo de cifrado. 
Un token estándar JWT consta de tres partes concatenadas por puntos (`.`):
$$\text{JWT} = \underbrace{\text{Header}}_{\text{Base64URL}} \;.\; \underbrace{\text{Payload}}_{\text{Base64URL}} \;.\; \underbrace{\text{Signature}}_{\text{HMAC-SHA256}}$$

> [!CAUTION]
> **La codificación Base64URL NO ES CIFRADO.** Cualquier persona o intermediario que intercepte un JWT puede decodificar el Payload instantáneamente con una sola línea de código o en herramientas como `jwt.io`.
> Por lo tanto, en nuestra implementación de "Brasas & Wok":
> 1. **NUNCA** se incluye la contraseña del usuario en el token.
> 2. **NUNCA** se incluyen datos bancarios, números de tarjeta de crédito, CVV o códigos secretos.
> 3. El Payload del JWT de nuestro proyecto **únicamente contiene Claims públicos de identidad y autorización**:
>    - `sub` (*Subject*): Nombre de usuario (ej. `chef_martin`).
>    - `role`: Rol del usuario (ej. `ROLE_ADMIN` o `ROLE_CUSTOMER`).
>    - `iat` (*Issued At*): Marca de tiempo de emisión.
>    - `exp` (*Expiration*): Marca de tiempo de expiración (24 horas).
> La integridad del token está garantizada por la **Firma Digital (Signature)** calculada con la clave secreta del servidor (`app.jwt.secret`), asegurando que si un usuario malicioso intenta alterar su rol de `ROLE_CUSTOMER` a `ROLE_ADMIN` en el Payload, la firma no coincidirá y el servidor rechazará la petición inmediatamente.

---

### 3.6.2 Flujo Detallado de JWT en el Inicio de Sesión (Logueo)

A continuación se detalla el ciclo de vida completo cuando un usuario inicia sesión en la plataforma:

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Comensal / Administrador
    participant Browser as Frontend Angular (AuthModal)
    participant AuthService as Angular AuthService
    participant AuthController as Spring Boot AuthController
    participant AuthManager as AuthenticationManager (DaoProvider)
    participant UserDetailsSvc as UserDetailsServiceImpl
    participant DB as MySQL (Aiven Cloud)
    participant JwtUtils as JwtUtils Component

    Usuario->>Browser: Ingresa usuario ("chef_martin") y contraseña ("admin123")
    Browser->>AuthService: login(username, password)
    AuthService->>AuthController: POST /api/auth/login { "username": "chef_martin", "password": "..." }
    Note over AuthService,AuthController: Petición HTTPS cifrada con TLS 1.3
    AuthController->>AuthManager: authenticate(UsernamePasswordAuthenticationToken)
    AuthManager->>UserDetailsSvc: loadUserByUsername("chef_martin")
    UserDetailsSvc->>DB: SELECT * FROM users WHERE username = 'chef_martin'
    DB-->>UserDetailsSvc: Retorna registro con hash BCrypt
    UserDetailsSvc-->>AuthManager: Retorna UserDetailsImpl
    AuthManager->>AuthManager: passwordEncoder.matches(rawPassword, encodedPassword)
    Note over AuthManager: Valida la contraseña mediante BCrypt con Salt
    AuthManager-->>AuthController: Retorna Authentication exitoso
    AuthController->>JwtUtils: generateToken(Authentication)
    JwtUtils->>JwtUtils: Construye Claims (sub, role, iat, exp) y firma con HMAC-SHA256
    JwtUtils-->>AuthController: Retorna String JWT ("eyJhbGciOiJIUzI1Ni...")
    AuthController-->>AuthService: HTTP 200 OK { token, id, username, email, fullName, role }
    AuthService->>Browser: Guarda token en localStorage y actualiza Signals reactivas
    Browser->>Usuario: Muestra Toast "¡Bienvenido chef_martin!" y actualiza la Navbar
```

**Explicación técnica paso a paso del Logueo:**
1. **Captura en el Frontend:** El usuario diligencia el formulario de acceso en el componente `AuthModalComponent`.
2. **Envío seguro:** Se dispara el método `login()` del servicio `AuthService.ts`, enviando un payload JSON hacia el backend protegido bajo canal seguro HTTPS.
3. **Autenticación en Spring Security:** El controlador `AuthController.java` recibe el `LoginRequest` y lo delega al `AuthenticationManager`.
4. **Verificación en Base de Datos:** El `UserDetailsServiceImpl` busca el usuario en MySQL. Si existe, extrae el hash BCrypt de la columna `password`.
5. **Cotejo de Claves:** El `DaoAuthenticationProvider` ejecuta `passwordEncoder.matches()`. Este método toma la sal (*salt*) incrustada en el hash almacenado, hashea la contraseña recibida y compara los resultados en tiempo constante (inmune a ataques de temporización).
6. **Generación del Token:** Tras la autenticación exitosa, el componente `JwtUtils.java` construye el token JWT, estampa los *claims* no sensibles (`username` y `role`), asigna la expiración a 24 horas y firma el paquete con el algoritmo simétrico `Keys.hmacShaKeyFor(secretKeyBytes)`.
7. **Respuesta y Almacenamiento en Cliente:** El servidor responde con HTTP 200 y el objeto `AuthResponse`. En Angular, el `AuthService` guarda el token en el almacenamiento local seguro del navegador (`localStorage`) y actualiza el signal `_currentUser` y `_token`, lo que provoca que la interfaz oculte el botón de ingreso y muestre el avatar y nombre del usuario automáticamente.

---

### 3.6.3 Flujo Detallado de JWT en el Consumo de Servicios REST Protegidos

Una vez autenticado, cada petición a una ruta restringida (por ejemplo, registrar una orden de compra en `/api/orders`) debe adjuntar y validar el token JWT:

```mermaid
sequenceDiagram
    autonumber
    actor Usuario as Cliente Comensal
    participant UI as CheckoutModal (Angular)
    participant Interceptor as authInterceptor (Angular HTTP)
    participant Filter as JwtAuthenticationFilter (Spring)
    participant JwtUtils as JwtUtils (Spring)
    participant UserDetailsSvc as UserDetailsServiceImpl
    participant SecurityContext as SecurityContextHolder
    participant OrderCtrl as OrderController (@PreAuthorize)
    participant OrderSvc as OrderServiceImpl
    participant DB as MySQL (Aiven Cloud)

    Usuario->>UI: Clic en "Pagar y Enviar Comanda"
    UI->>Interceptor: HttpClient.post('/api/orders', orderPayload)
    Interceptor->>Interceptor: Lee token del AuthService Signal
    Interceptor->>Filter: Inyecta cabecera -> Authorization: Bearer eyJhbGciOi...
    Note over Interceptor,Filter: Petición enviada hacia Render en HTTPS
    Filter->>Filter: parseJwt(request) -> Extrae cadena tras 'Bearer '
    Filter->>JwtUtils: validateJwtToken(jwt)
    JwtUtils->>JwtUtils: Verifica firma HMAC-SHA256 y fecha de expiración
    JwtUtils-->>Filter: Firma válida y no expirado (true)
    Filter->>JwtUtils: getUsernameFromToken(jwt)
    JwtUtils-->>Filter: Retorna "cliente_juan"
    Filter->>UserDetailsSvc: loadUserByUsername("cliente_juan")
    UserDetailsSvc->>DB: SELECT * FROM users WHERE username = 'cliente_juan'
    DB-->>UserDetailsSvc: Retorna usuario con rol ROLE_CUSTOMER
    UserDetailsSvc-->>Filter: Retorna UserDetails
    Filter->>SecurityContext: setAuthentication(UsernamePasswordAuthenticationToken)
    Note over Filter,SecurityContext: El usuario queda autenticado en el hilo de ejecución
    Filter->>OrderCtrl: filterChain.doFilter() -> Ejecuta controlador
    OrderCtrl->>OrderCtrl: Evalúa @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    Note over OrderCtrl: Permiso concedido exitosamente
    OrderCtrl->>OrderSvc: createOrder(request, userDetails)
    OrderSvc->>DB: INSERT INTO orders ... & INSERT INTO order_items ...
    DB-->>OrderSvc: Confirmación de persistencia
    OrderSvc-->>OrderCtrl: Retorna OrderResponse con número de comanda
    OrderCtrl-->>UI: HTTP 201 Created { id: 15, orderNumber: "ORD-849201", ... }
    UI->>Usuario: Muestra modal de compra confirmada y vacía el carrito
```

**Explicación técnica paso a paso del Consumo de la API Protegida:**
1. **Petición del Componente:** El componente de Angular `CheckoutModalComponent` ejecuta `this.http.post(`${environment.apiUrl}/orders`, payload)`.
2. **Interceptación Automática en Frontend:** La función `authInterceptor` (configurada como interceptor funcional en `app.config.ts`) clona la petición HTTP saliente e inyecta la cabecera estándar:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. **Filtro OncePerRequest en Backend:** En Spring Boot, antes de que la petición llegue a cualquier endpoint, pasa por `JwtAuthenticationFilter.java` (que hereda de `OncePerRequestFilter`).
4. **Validación Criptográfica de Firma:** El filtro invoca `jwtUtils.validateJwtToken(token)`. El analizador de JJWT (`Jwts.parser().verifyWith(getSigningKey()).build()`) verifica matemáticamente la firma utilizando la clave secreta del backend. Si el token expiró o fue adulterado por terceros, la validación falla silenciosamente y la petición continúa como anónima.
5. **Carga del Contexto de Seguridad:** Si la firma es íntegra, se extrae el nombre de usuario y se instancia un `UsernamePasswordAuthenticationToken` con sus roles correspondientes (`ROLE_CUSTOMER`), depositándolo en el `SecurityContextHolder.getContext().setAuthentication(...)`.
6. **Validación de Reglas de Autorización:** La petición arriba a `OrderController.java`. Al estar decorado con:
   ```java
   @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
   ```
   Spring Security comprueba que el usuario en el contexto posea dicho rol. Si un usuario no autenticado intenta entrar, recibe `HTTP 401 Unauthorized`. Si un usuario con `ROLE_ADMIN` intentara llamar a este endpoint de compra de delivery, el sistema le denegará el paso arrojando `HTTP 403 Forbidden`.
7. **Ejecución y Respuesta:** El servicio crea la orden en base de datos, asocia al usuario autenticado mediante `@AuthenticationPrincipal UserDetailsImpl userDetails` y devuelve el resultado con código `201 Created`.

---

## 3.7 Front-end (UI/UX)

### Arquitectura de Componentes y Ruteo
El frontend está desarrollado bajo el estándar moderno de **Angular 19** utilizando componentes autónomos (`standalone: true`). La aplicación desacopla las vistas mediante dos layouts estructurales principales:
1. `PublicLayoutComponent`: Incluye la cabecera de comensal, barra de navegación interactiva, botón flotante del carrito y pie de página gastronómico. Aloja las rutas públicas: `/` (Inicio), `/carta` (Menú completo), `/horarios`, `/sedes` y `/mis-pedidos` (protegida por `authGuard`).
2. `AdminLayoutComponent`: Interfaz técnica con barra lateral de navegación colapsable diseñada para la operación del restaurante: `/admin/dashboard` (Métricas), `/admin/menu` (Gestión de platos), `/admin/categories` (Gestión de secciones), `/admin/kitchen` (KDS en vivo) y `/admin/orders` (Listado y auditoría de comandas). Rutas protegidas por `adminGuard`.

### Gestión Reactiva del Estado con Angular Signals
Se descartaron librerías complejas como NgRx a favor del sistema nativo de **Angular Signals**, que ofrece reactividad de granularidad fina:
- **`CartService`:** Administra el estado global del carrito mediante un signal reactivo `items = signal<CartItem[]>([])`.
  - El total a pagar se calcula automáticamente mediante computación reactiva:
    $$\text{total} = \text{computed}(() \Rightarrow \text{subtotal}() + \text{deliveryFee}())$$
  - Cada vez que un comensal modifica una cantidad, la interfaz se refresca instantáneamente sin recálculos pesados del árbol de componentes.
- **`AuthService`:** Mantiene signals reactivos para el estado de autenticación: `currentUser = signal<User | null>(...)` y `isLoggedIn = computed(() => !!this.currentUser())`.

### Rediseño y Simplificación Visual UI/UX
En base a la auditoría de experiencia de usuario, la interfaz se simplificó eliminando tarjetas redundantes, gradientes pesados y animaciones que ralentizaban la compra. El nuevo diseño se apoya en una estética limpia inspirada en la gastronomía peruano-oriental:
- Superficies neutras y espacios en blanco generosos para reducir la carga cognitiva.
- Uso del color primario de marca (`#E63946` rojo brasa) exclusivamente en botones de llamada a la acción (*CTA*), precios e indicadores de estado crítico.
- Adaptabilidad mobile-first con soporte para gestos táctiles en el cajón lateral (*Cart Drawer*) y modales con bloqueo de scroll.

---

## 3.8 Back-end

### Implementación de CRUDs y Modularidad
El backend implementa de forma completa las operaciones Crear, Leer, Actualizar y Eliminar (CRUD) para tres entidades centrales del negocio:
1. **Productos / Platos (`ProductController`):**
   - Creación y edición con validación de precios positivos y asignación obligatoria de categoría.
   - Baja lógica (`isAvailable = false`) para suspender platos temporalmente sin romper la integridad referencial de pedidos históricos.
2. **Categorías (`CategoryController`):**
   - Organización jerárquica con generación de slug amigable y ordenamiento visual (`displayOrder`).
3. **Comandas y Pedidos (`OrderController` y `AdminOrderController`):**
   - Creación transaccional de órdenes vinculando múltiples ítems en un solo bloque atómico de base de datos.
   - Consulta de comandas con filtrado por estado (`status`) y búsqueda por número correlativo.

### Manejo Global de Excepciones y Logging
- **`GlobalExceptionHandler.java`:** Utiliza la anotación `@RestControllerAdvice` para interceptar excepciones en cualquier controlador:
  - `ResourceNotFoundException`: Retorna HTTP 404 con mensaje claro.
  - `BadRequestException`: Retorna HTTP 400 ante violaciones lógicas de negocio.
  - `MethodArgumentNotValidException`: Captura fallos de validación en los formularios y retorna una lista legible con los campos erróneos.
  - `AccessDeniedException`: Retorna HTTP 403 ante intentos de acceso no autorizados.
- **Logging Estructurado:** Integración de `LoggerFactory.getLogger(...)` de SLF4J para registrar trazas en tiempo real sobre transacciones, inicios de sesión y emisiones de WebSockets.

---

## 3.9 Comunicación en tiempo real (WebSockets STOMP)

### Configuración del Broker (`WebSocketConfig.java`)
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-brasas-socket")
                .setAllowedOriginPatterns("*"); // Compatible con Vercel y localhost
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
```

### Canales y Notificaciones en Vivo (`OrderStatusNotificationService.java`)
El sistema implementa dos flujos de eventos concurrentes:
1. **Canal de Nuevas Comandas para Cocina (`/topic/admin`):**
   Cuando un cliente finaliza su compra, el backend ejecuta `notifyNewOrder(order)`. La pantalla de cocina (KDS) suscrita a este canal recibe el payload JSON y añade el nuevo ticket con sonido de alerta sin necesidad de intervención manual.
2. **Canal de Estado de Orden para el Cliente (`/topic/orders/{id}/status`):**
   Cuando el cocinero avanza el pedido a `EN_COCINA` o `EN_CAMINO`, el backend despacha un mensaje al tópico específico de esa orden. La vista "Mis Pedidos" del cliente escucha dicho evento y actualiza la barra de progreso en milisegundos.

---

## 3.10 Despliegue e infraestructura

### Desacoplamiento de Entornos y Variables Seguras
Para garantizar que el código sea agnóstico al entorno donde se ejecuta (principio de los *12-Factor Apps*), se centralizaron las variables de configuración:
- **Frontend:**
  - `environment.ts` (Desarrollo local): Apunta a `http://localhost:8080/api` y `ws://localhost:8080/ws-brasas-socket`.
  - `environment.prod.ts` (Producción en Vercel): Apunta a `https://brasaswok-backend.onrender.com/api` y `wss://brasaswok-backend.onrender.com/ws-brasas-socket`.
- **Backend:**
  - Archivo de respaldo documentado [.env.example](file:///c:/Users/marti/Documents/Ciclo%209/Desarrollo%20Full%20Stack/.env.example) para versionado en Git sin credenciales.
  - Archivo local `.env` protegido por `.gitignore`.
  - En `application.properties`, Spring Boot carga automáticamente las variables de entorno inyectadas por el proveedor en la nube o leídas del `.env`.

### Dockerización del Backend (`backend/Dockerfile`)
Construcción multi-etapa (*Multi-stage Build*) optimizada para producción:
```dockerfile
# Etapa 1: Compilación con Maven y JDK 21
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen de ejecución ligera con JRE 21
FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app
RUN addgroup --system spring && adduser --system --ingroup spring spring && \
    mkdir -p /app/uploads && \
    chown -R spring:spring /app
USER spring:spring
COPY --from=build --chown=spring:spring /app/target/*.jar app.jar
ENV PORT=8080
EXPOSE ${PORT}
ENTRYPOINT ["sh", "-c", "java -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-8080} -jar app.jar"]
```

### Orquestación Local con Docker Compose (`docker-compose.yml`)
Permite a cualquier evaluador o desarrollador levantar el stack completo (MySQL 8.0, Backend Spring Boot y Frontend Nginx) con un solo comando: `docker compose up -d`.

---

## 3.11 Monitoreo y observabilidad

### Endpoint de Comprobación de Salud (`HealthController.java`)
Para que los sistemas de monitoreo y balanceadores de carga verifiquen el estado operativo de la API sin requerir autenticación, se implementó el endpoint:
- `GET https://brasaswok-backend.onrender.com/api/health`
- Respuesta (`200 OK`):
  ```json
  {
    "status": "UP",
    "service": "Brasas & Wok Backend API",
    "timestamp": 1790819200000
  }
  ```

### Estrategia de Disponibilidad Continua (Keep-Alive con UptimeRobot)
En plataformas de hosting gratuito en la nube (como el plan Free de Render), los contenedores que no reciben tráfico durante 15 minutos entran en hibernación (*spin down*), lo que provocaría demoras de hasta 50 segundos en la primera visita de un cliente. 
Para neutralizar esta limitación:
1. Se configuró un monitor HTTP en **UptimeRobot**.
2. La sonda emite una petición `GET /api/health` periódicamente cada 10 minutos.
3. El servidor interpreta actividad continua, manteniendo el contenedor activo las 24 horas del día con respuesta inmediata para la sustentación y evaluación del proyecto.

---

## 3.12 Pruebas y calidad

### Batería de Pruebas Unitarias Automatizadas (JUnit 5 + Mockito)
Se implementaron pruebas unitarias en el backend para validar de forma aislada la lógica crítica sin depender de una base de datos activa:

| Clase de Prueba | Módulo Evaluado | Escenarios Probados | Resultado |
| :--- | :--- | :--- | :--- |
| `JwtUtilsTest` | Seguridad / JWT | Generación de token con claims, validación exitosa de firma y rechazo automático de tokens alterados o malformados. | **Passed (100%)** |
| `OrderServiceImplTest` | Lógica de Pedidos | Creación de comanda con cálculo matemático de subtotales, rechazo de órdenes sin ítems y cambio de estados con emisión de logs. | **Passed (100%)** |
| `PaymentServiceImplTest` | Lógica de Pagos | Procesamiento de pago simulado vinculado a una orden y validación de coincidencia de montos. | **Passed (100%)** |
| `OrderControllerTest` | Capa Web / MockMvc | Validación de endpoints protegidos por JWT, verificación de códigos HTTP 201 Created y serialización de JSON. | **Passed (100%)** |
| `AdminOrderControllerTest`| Administración Web | Verificación de acceso exclusivo para `ROLE_ADMIN` y rechazo con HTTP 403 a usuarios convencionales. | **Passed (100%)** |

### Ejemplo de Prueba Unitaria (`JwtUtilsTest.java`):
```java
@Test
void shouldGenerateAndValidateToken() {
    String token = jwtUtils.generateTokenFromUsername("chef_martin", "ROLE_ADMIN");

    assertNotNull(token);
    assertTrue(jwtUtils.validateJwtToken(token));
    assertEquals("chef_martin", jwtUtils.getUsernameFromToken(token));
}

@Test
void shouldRejectInvalidToken() {
    assertFalse(jwtUtils.validateJwtToken("invalid.token.here"));
}
```

---

## 3.13 Gestión del proyecto

*(Sección estructurada a nivel de avance intermedio para APF2 — Semana 14)*

### Metodología de Trabajo: Scrum Adaptado con Tablero Kanban
Para la organización del equipo de desarrollo se adoptó el marco de trabajo ágil **Scrum**, complementado con un flujo visual **Kanban** en GitHub Projects. El desarrollo se estructuró en Sprints de 2 semanas de duración:
- **Sprint 1 (Semanas 8 a 10):** Diseño del modelo relacional, configuración inicial de Spring Boot, repositorios JPA y maquetación preliminar del frontend.
- **Sprint 2 (Semanas 11 a 12):** Implementación de Spring Security 6 con JWT, autenticación en cliente, catálogo interactivo con Signals y persistencia de carritos.
- **Sprint 3 (Semanas 13 a 14 - Hito Actual APF2):** Integración de WebSockets STOMP para cocina en tiempo real, Dockerización completa, despliegue desacoplado en Vercel, Render y Aiven Cloud, monitoreo con UptimeRobot y batería de pruebas con JUnit.

### Roles y Responsabilidades
- **Product Owner:** Encargado de levantar los requerimientos del restaurante, priorizar el Product Backlog y validar los criterios de aceptación de cada historia de usuario.
- **Scrum Master & DevOps Lead (Martín Gonzales):** Facilita las ceremonias ágiles, remueve impedimentos técnicos y gestiona la infraestructura de integración y despliegue continuo (CI/CD) con Docker, GitHub y los proveedores Cloud.
- **Development Team (Equipo Full Stack):** Encargado de la codificación de componentes Angular, endpoints REST en Java 21, pruebas unitarias y refactorización UI/UX.

### Burndown Chart (Semana 14 — APF2)
El siguiente gráfico ilustra la quema de Puntos de Historia (*Story Points*) planificados frente a los ejecutados a lo largo del ciclo académico hasta el corte de la Semana 14:

```mermaid
xychart-beta
    title "Burndown Chart Acumulado — Proyecto Brasas & Wok (Hito APF2)"
    x-axis ["Semana 8 (APF1)", "Semana 9", "Semana 10", "Semana 11", "Semana 12", "Semana 13", "Semana 14 (APF2)"]
    y-axis "Story Points Pendientes" 0 --> 100
    line "Trabajo Ideal Planificado" [100, 85, 70, 55, 40, 25, 10]
    line "Trabajo Real Ejecutado" [100, 88, 72, 50, 38, 20, 8]
```

**Análisis de la Quema de Puntos de Historia:**
- **Semanas 8 a 10:** El equipo mantuvo un ritmo ligeramente por debajo de la línea ideal debido a la curva de aprendizaje en la configuración de Spring Security 6 y el driver JDBC con SSL en Aiven Cloud.
- **Semanas 11 a 14:** Con la arquitectura base estabilizada, la velocidad del equipo aumentó notablemente al implementar las Signals de Angular 19 y los WebSockets, cerrando la Semana 14 con únicamente 8 puntos de historia pendientes (correspondientes al pulido final y reporte gerencial para la entrega final PROY de la Semana 18).

---

*(Fin del documento del Segundo Avance APF2)*
