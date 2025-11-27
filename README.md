# 🎬 UANFilms - Plataforma de Gestión de Películas 

---

## 🚀 Inicio Rápido

Sigue estos pasos para poner el proyecto UANFilms en funcionamiento en tu máquina local.

### 📋 Requisitos Previos

Necesitarás tener instalado:

* **Python 3.12
* **Git** (para clonar el repositorio)
* **Pip** (gestor de paquetes de Python)

---

## 💻 Configuración del Entorno Local

### 1. Clonar el Repositorio

Abre tu terminal y ejecuta:
```bash
git clone https://github.com/jamessarmiento13/proyecto_uanfilms.git
cd main
```

### 2. Crear y activar entorno virtual
Es fundamental trabajar con un entorno virtual para aislar las dependencias del proyecto.

### Linux/macOS:
```bash
python3 -m venv env
source env/bin/activate
```

### Windows:
```bash
python -m venv env
.\env\Scripts\activate
```

### 3. Instalar dependencias
Instala todas las dependencias nesesarias
```bash
pip install -r requirements.txt
```

---

## ⚙️ Configuración del Proyecto

###  4. Configurar la Base de Datos

El proyecto usa la base de datos por defecto de Django (SQLite) sigue los siguientes pasos:

### A. Aplicar Migraciones

Ejecuta las migraciones para crear las tablas de la base de datos:
```bash
python manage.py migrate
```

### B. Crear Superusuario (Opcional)
```bash
python manage.py createsuperuser
``` 
*(Sigue las instrucciones en pantalla para crear el usuario y la contraseña).*

### 5. Archivos Estáticos (Estilos y JS)

Los archivos estáticos (CSS, JavaScript) deben ser recolectados para asegurar que Django los sirva correctamente.

```bash
python manage.py collectstatic
```
*(Confirma si se te pregunta).*

---

## ▶️ Ejecución del Servidor

Una vez completada la configuración, inicia el servidor de desarrollo local:
```bash
python manage.py runserver
```
El servidor estará disponible en la siguiente dirección:

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

