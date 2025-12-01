# 🏗️ Plan de Arquitectura: Uniclima E-commerce con Vendure

## 📋 Resumen del Estado Actual

### ✅ Lo que ya tienes configurado:

| Componente | Estado | Ubicación | Puerto |
|------------|--------|-----------|--------|
| Vendure v3.5.1 | ✅ Instalado | `Uniclima---Desarrollo/vendure-backend/` | 3000 ⚠️ |
| PostgreSQL | ✅ Docker configurado | Docker | 6543 |
| Next.js 14.2 | ✅ Proyecto existente | `Uniclima---Desarrollo/` | 3000 ⚠️ |
| MongoDB | ⚠️ A eliminar | En código | - |

### ⚠️ Conflicto de Puertos Detectado
- **Vendure** y **Next.js** ambos usan puerto **3000**
- **Solución**: Cambiar Vendure a puerto **3001**

---

## 🎯 Arquitectura Propuesta

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                              │
│                      Puerto: 3000                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ design-system/          │ components/                       ││
│  │  ├── tokens.css         │  ├── core/      (Botones, Cards)  ││
│  │  └── themes/            │  ├── sections/  (ProductCard)     ││
│  │       ├── default.css   │  └── layout/    (Header, Footer)  ││
│  │       └── premium.css   │                                   ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ lib/vendure/  ← NO TOCAR EN REDISEÑOS                       ││
│  │  ├── client.ts     (Apollo Client config)                   ││
│  │  ├── queries.ts    (GraphQL queries)                        ││
│  │  └── mutations.ts  (Carrito, Checkout)                      ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VENDURE BACKEND                               │
│                      Puerto: 3001                                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │   Shop API     │  │   Admin API    │  │   Dashboard    │     │
│  │  /shop-api     │  │  /admin-api    │  │  /dashboard    │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Productos HVAC con Custom Fields:                           ││
│  │  - potencia, frigorias, clase_energetica, etc.              ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL                                    │
│                      Puerto: 6543                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Conceptos Clave para Entender

### 🔷 ¿Qué es GraphQL?
GraphQL es un lenguaje de consultas para APIs. A diferencia de REST donde tienes múltiples endpoints:
- REST: `GET /products`, `GET /products/1`, `GET /categories`
- GraphQL: Un solo endpoint (`/shop-api`) donde pides exactamente lo que necesitas

**Ejemplo de Query GraphQL:**
```graphql
query {
  products {
    items {
      name
      slug
      variants {
        price
        sku
      }
    }
  }
}
```

### 🔷 ¿Qué es Apollo Client?
Es una librería que conecta tu React/Next.js con un servidor GraphQL. Maneja:
- Las peticiones al servidor
- El caché de datos
- El estado de la aplicación

### 🔷 ¿Qué son los Custom Fields en Vendure?
Son campos personalizados que añades a las entidades de Vendure. Para productos de climatización necesitarás:
- `potencia`: Potencia en kW
- `frigorias`: Frigorías/hora
- `claseEnergetica`: A+++, A++, A+, etc.
- `refrigerante`: R32, R410A, etc.
- `wifi`: Boolean

### 🔷 ¿Qué son los Facets?
Son atributos para filtrar productos. En tu caso:
- **Marca**: Daikin, Mitsubishi, LG, Fujitsu
- **Potencia**: 2.5kW, 3.5kW, 5kW, 7kW
- **Clase Energética**: A+++, A++, A+

### 🔷 ¿Qué son las Collections?
Son las categorías de productos:
- Aire Acondicionado
  - Split
  - Multisplit
  - Conductos
- Calderas
- Accesorios
- Servicios de Instalación

---

## 🚀 Fases de Implementación

### Fase 1: Configuración de Vendure (EMPEZAR AQUÍ)

**Paso 1.1: Cambiar puerto de Vendure a 3001**
```bash
# En vendure-backend/.env cambiar:
PORT=3001
```

**Paso 1.2: Iniciar PostgreSQL**
```bash
cd Uniclima---Desarrollo/vendure-backend
docker compose up -d postgres_db
```

**Paso 1.3: Iniciar Vendure**
```bash
npm run dev
```

**Paso 1.4: Acceder al Dashboard**
- URL: `http://localhost:3001/dashboard`
- Usuario: `superadmin`
- Password: `superadmin`

**Paso 1.5: Configurar Canal España**
En el Dashboard:
1. Settings → Channels → Edit Default Channel
2. Cambiar nombre a "España"
3. Configurar EUR como moneda
4. Configurar idioma español

---

### Fase 2: Productos y Colecciones en Vendure

**Custom Fields para Productos HVAC:**
```typescript
// En vendure-config.ts
customFields: {
  Product: [
    { name: 'potenciaKw', type: 'float', label: [{ languageCode: 'es', value: 'Potencia (kW)' }] },
    { name: 'frigorias', type: 'int', label: [{ languageCode: 'es', value: 'Frigorías/hora' }] },
    { name: 'claseEnergetica', type: 'string', label: [{ languageCode: 'es', value: 'Clase Energética' }] },
    { name: 'refrigerante', type: 'string', label: [{ languageCode: 'es', value: 'Refrigerante' }] },
    { name: 'wifi', type: 'boolean', label: [{ languageCode: 'es', value: 'WiFi Integrado' }] },
    { name: 'garantiaAnos', type: 'int', label: [{ languageCode: 'es', value: 'Garantía (años)' }] },
  ],
}
```

**Facets a Crear:**
| Facet | Valores |
|-------|---------|
| Marca | Daikin, Mitsubishi Electric, LG, Fujitsu, Samsung |
| Tipo | Split, Multisplit, Conductos, Cassette |
| Clase Energética | A+++, A++, A+, A, B |

**Colecciones a Crear:**
```
📁 Climatización
   ├── 📁 Aire Acondicionado
   │   ├── Split
   │   ├── Multisplit
   │   ├── Conductos
   │   └── Cassette
   ├── 📁 Calderas
   │   ├── Condensación
   │   └── Biomasa
   ├── 📁 Accesorios
   └── 📁 Servicios
       ├── Instalación
       └── Mantenimiento
```

---

### Fase 3: Frontend Modular

**Estructura de Carpetas Propuesta:**
```
src/
├── lib/
│   └── vendure/                    # ⚠️ NO TOCAR EN REDISEÑOS
│       ├── client.ts               # Configuración Apollo Client
│       ├── queries/
│       │   ├── products.ts         # Queries de productos
│       │   ├── collections.ts      # Queries de colecciones
│       │   └── cart.ts             # Queries del carrito
│       └── mutations/
│           ├── cart.ts             # Añadir/quitar del carrito
│           └── checkout.ts         # Proceso de checkout
│
├── components/
│   ├── core/                       # Componentes base (reutilizables)
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── Badge/
│   │
│   ├── sections/                   # Secciones reemplazables
│   │   ├── ProductCard/
│   │   ├── ProductGrid/
│   │   ├── ProductFilters/
│   │   ├── CartDrawer/
│   │   └── CheckoutForm/
│   │
│   └── layout/                     # Estructura de página
│       ├── Header/
│       ├── Footer/
│       └── Sidebar/
│
├── design-system/                  # Sistema de temas
│   ├── tokens.css                  # Variables CSS globales
│   └── themes/
│       ├── default.css             # Tema actual
│       └── premium.css             # Para cambios futuros
│
└── app/                            # Páginas Next.js
    ├── page.tsx                    # Home
    ├── productos/
    │   ├── page.tsx                # Listado
    │   └── [slug]/page.tsx         # Detalle
    ├── carrito/page.tsx
    └── checkout/page.tsx
```

**Cómo funciona el cambio de tema:**
```tsx
// En layout.tsx
import '@/design-system/tokens.css';
import '@/design-system/themes/default.css';  // Cambiar a premium.css para nuevo diseño
```

---

### Fase 4: Integración Frontend-Vendure

**Ejemplo de Query GraphQL para Productos:**
```typescript
// lib/vendure/queries/products.ts
import { gql } from '@apollo/client';

export const GET_PRODUCTS = gql`
  query GetProducts($take: Int, $skip: Int) {
    products(options: { take: $take, skip: $skip }) {
      totalItems
      items {
        id
        name
        slug
        description
        featuredAsset {
          preview
        }
        variants {
          id
          name
          priceWithTax
          sku
        }
        customFields {
          potenciaKw
          frigorias
          claseEnergetica
          wifi
        }
      }
    }
  }
`;
```

---

## ❓ Preguntas de Clarificación

Antes de continuar, necesito algunas decisiones tuyas:

1. **¿Dónde crear el proyecto frontend?**
   - **Opción A**: Modificar el proyecto existente `Uniclima---Desarrollo` (reutilizar componentes)
   - **Opción B**: Crear proyecto nuevo en `Uniclima-Vendure` (empezar limpio)

2. **¿Qué productos de ejemplo quieres crear primero?**
   - ¿Tienes una lista de productos reales de Uniclima?
   - ¿Prefieres que use productos ficticios de ejemplo?

3. **¿Tienes acceso a las imágenes de productos?**
   - Necesitaremos subir imágenes al Asset Server de Vendure

4. **¿Quieres configurar métodos de pago reales?**
   - Por ahora está el `dummyPaymentHandler` (para testing)
   - ¿Planeas usar Stripe, PayPal, Redsys, etc.?

---

## 📝 Próximos Pasos Inmediatos

1. **Aprobar este plan** o sugerir cambios
2. **Cambiar a modo Code** para:
   - Modificar el puerto de Vendure
   - Iniciar los servicios
   - Acceder al Dashboard
3. **Crear productos de ejemplo** en el Admin UI

¿Estás de acuerdo con este plan? ¿Hay algo que quieras modificar o añadir?