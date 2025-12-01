# 🚀 Guía de Inicio Rápido - Uniclima Vendure

## ✅ Problemas Críticos Resueltos

Se han corregido los siguientes problemas que impedían el levantamiento del backend:

1. ✅ **Base de datos migrada** de SQLite a PostgreSQL
2. ✅ **Dockerfile.dev corregido** con instalación de dependencias
3. ✅ **Driver PostgreSQL instalado** (`pg` package)
4. ✅ **Docker Compose optimizado** con health checks y networks

---

## 📋 Pasos para Levantar el Proyecto

### 1️⃣ Levantar la Base de Datos PostgreSQL

```bash
docker-compose up db -d
```

Esto iniciará PostgreSQL en el puerto `6543` (mapeado desde el `5432` interno).

### 2️⃣ Verificar que PostgreSQL está listo

```bash
docker-compose logs db
```

Deberías ver: `database system is ready to accept connections`

### 3️⃣ Levantar el Backend de Vendure

```bash
docker-compose up backend
```

Esto:
- Construirá la imagen Docker si no existe
- Instalará las dependencias dentro del contenedor
- Iniciará Vendure en modo desarrollo
- Estará disponible en `http://localhost:3001`

### 4️⃣ Acceder al Dashboard

Una vez que el backend esté corriendo, accede a:

**URL**: http://localhost:3001/dashboard

**Credenciales**:
- Usuario: `superadmin`
- Contraseña: `superadmin`

### 5️⃣ Verificar GraphQL API

Puedes probar el GraphQL Playground en:

**Shop API**: http://localhost:3001/shop-api
**Admin API**: http://localhost:3001/admin-api

---

## 🛠️ Comandos Útiles

### Ver logs del backend
```bash
docker-compose logs -f backend
```

### Ver logs de la base de datos
```bash
docker-compose logs -f db
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Detener todo
```bash
docker-compose down
```

### Detener y eliminar volúmenes (⚠️ borra la BD)
```bash
docker-compose down -v
```

### Reconstruir las imágenes
```bash
docker-compose build --no-cache
docker-compose up
```

---

## 📊 Arquitectura Actual

```
┌─────────────────────────────────────┐
│  Frontend (por crear)               │
│  Puerto: 3000                       │
└─────────────────────────────────────┘
              │
              │ GraphQL HTTP
              ▼
┌─────────────────────────────────────┐
│  Vendure Backend                    │
│  Puerto: 3001                       │
│  - Shop API: /shop-api              │
│  - Admin API: /admin-api            │
│  - Dashboard: /dashboard            │
└─────────────────────────────────────┘
              │
              │ PostgreSQL Protocol
              ▼
┌─────────────────────────────────────┐
│  PostgreSQL 13                      │
│  Puerto: 6543 (host) → 5432 (docker)│
└─────────────────────────────────────┘
```

---

## 🎯 Próximos Pasos

Revisa el archivo [`TODO.md`](./TODO.md) para ver todas las tareas pendientes:

- [ ] **Configurar Custom Fields** para productos HVAC
- [ ] **Crear Facets** (filtros de marca, potencia, etc.)
- [ ] **Crear Collections** (categorías de productos)
- [ ] **Crear productos de prueba** desde el Dashboard
- [ ] **Configurar frontend Next.js** con Apollo Client
- [ ] **Integrar las queries GraphQL** desde el frontend

---

## ⚠️ Notas Importantes

1. **Primera ejecución**: La primera vez que levantes el backend, Vendure creará automáticamente las tablas en PostgreSQL porque `synchronize: true` está activado en modo desarrollo.

2. **Datos persistentes**: Los datos de la base de datos se guardan en `./db-data/`. No elimines esta carpeta si quieres mantener tus datos.

3. **Modo desarrollo**: El backend usa `npm run dev` que recarga automáticamente cuando cambias archivos en `./backend/src/`.

4. **Credenciales**: Las credenciales por defecto (`superadmin`/`superadmin`) son seguras SOLO para desarrollo. Cámbialas en producción.

---

## 🐛 Troubleshooting

### El backend no se conecta a la BD
- Verifica que PostgreSQL esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs db`
- Asegúrate de que el health check pase

### Puerto 3001 ya está en uso
- Cambia el puerto en `docker-compose.yml` y en `backend/.env`
- O detén el proceso que usa el puerto 3001

### Cambios no se reflejan
- El volumen `-./backend:/usr/src/app` sincroniza cambios automáticamente
- Si no funciona, reconstruye: `docker-compose build backend`

---

¿Necesitas ayuda? Revisa [`PLAN.md`](./PLAN.md) para más detalles sobre la arquitectura.
