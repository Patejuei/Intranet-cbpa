# Intranet CBPA (Cuerpo de Bomberos de Puente Alto)

Bienvenido al repositorio de la Intranet del Cuerpo de Bomberos de Puente Alto. Esta aplicación es una plataforma integral para la gestión administrativa y operativa del cuerpo de bomberos.

## 🚀 Características Principales

Esta aplicación cuenta con varios módulos diseñados para facilitar las operaciones diarias:

- **Autenticación y Usuarios**: Sistema seguro de inicio de sesión y gestión de perfiles de usuario (Bomberos y Administradores).
- **Asistencia**: Registro y visualización de asistencia a actos de servicio y academias.
- **Bitácoras**: Control de bitácoras para las unidades (Material Mayor), incluyendo registro de kilometraje y conductores.
- **Material Mayor y Menor**:
    - Gestión de inventario de material menor.
    - Registros de estado de baterías (`BatteryLog`).
    - Registros de equipos (`EquipmentLog`).
- **Certificados de Entrega**: Generación y administración de certificados de entrega de equipos (`DeliveryCertificate`).
- **Sistema de Tickets**: Módulo para reportar y dar seguimiento a problemas o requerimientos técnicos, con soporte para mensajería.
- **Configuración**: Módulo de ajustes del sistema.

## 🛠️ Tecnologías Utilizadas

Este proyecto utiliza un stack moderno y robusto:

### Backend

- **Laravel 12**: Framework PHP de última generación.
- **Laravel Fortify**: Backend de autenticación agnóstico del frontend.
- **PHP 8.2+**: Lenguaje de programación.
- **MySQL/MariaDB**: Base de datos relacional (configurada en entorno local).

### Frontend

- **React 19**: Biblioteca para construir interfaces de usuario.
- **Inertia.js 2.0**: Puente entre Laravel y React para construir SPAs monolíticas.
- **TailwindCSS 4**: Framework de utilidades CSS para diseño rápido y responsivo.
- **Vite 7**: Herramienta de compilación ultrarrápida.
- **Radix UI**: Primitivas de UI accesibles y sin estilos.
- **Lucide React**: Biblioteca de iconos.

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- PHP >= 8.2
- Composer
- Node.js & NPM
- Servidor de Base de Datos (MySQL o MariaDB, p.ej. vía XAMPP)

## ⚙️ Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente:

1.  **Clonar el repositorio**

    ```bash
    git clone <url-del-repositorio>
    cd intranet-cbpa
    ```

2.  **Instalar dependencias de Backend**

    ```bash
    composer install
    ```

3.  **Instalar dependencias de Frontend**

    ```bash
    npm install
    ```

4.  **Configurar variables de entorno**
    Copia el archivo de ejemplo y configura tu base de datos:

    ```bash
    cp .env.example .env
    ```

    Abre el archivo `.env` y ajusta las credenciales de base de datos (`DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`).

5.  **Generar clave de aplicación**

    ```bash
    php artisan key:generate
    ```

6.  **Ejecutar migraciones**
    Crea las tablas en la base de datos:

    ```bash
    php artisan migrate
    ```

7.  **Iniciar servidores de desarrollo**
    Necesitarás dos terminales:

    Terminal 1 (Vite - Frontend):

    ```bash
    npm run dev
    ```

    Terminal 2 (Laravel - Backend):

    ```bash
    php artisan serve
    ```

La aplicación estará disponible típicamente en `http://127.0.0.1:8000`.

## 🤝 Contribución

Si deseas contribuir, por favor asegúrate de seguir los estándares de código y ejecutar los tests antes de enviar un Pull Request.

---

_Desarrollado para el Cuerpo de Bomberos de Puente Alto._
