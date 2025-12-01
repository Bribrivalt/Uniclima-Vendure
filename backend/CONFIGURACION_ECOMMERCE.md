# Configuración E-commerce - Uniclima

**Fecha**: 1 de diciembre de 2024  
**Responsable**: Desarrollador 2 (Rama 2)  
**Estado**: ✅ Completado

---

## Resumen

- **Zona**: España
- **Impuestos**: IVA 21% (incluido en precio)
- **Métodos de envío**: 3
- **Métodos de pago**: Dummy (desarrollo)
- **Canal**: Default channel (EUR, España)
- **Stock tracking**: Activado

---

## Zonas Geográficas

### España
- **Países**: Spain (ES)
- **Uso**: Impuestos y envíos

---

## Impuestos

### IVA Estándar (21%)
- **Tax Category**: IVA Estándar
- **Tax Rate**: IVA 21% España
- **Zona**: España
- **Valor**: 21%
- **Include in price**: ✓ Sí
- **Por defecto**: ✓ Sí

**Aplicado a**: Todos los productos por defecto

---

## Métodos de Envío

### 1. Envío Estándar Península
- **Precio**: 50€ (IVA incluido)
- **Tiempo**: 3-5 días laborables
- **Zona**: España

### 2. Envío Express 24-48h
- **Precio**: 100€ (IVA incluido)
- **Tiempo**: 24-48 horas
- **Zona**: España

### 3. Recogida en Tienda
- **Precio**: Gratis
- **Zona**: España

---

## Métodos de Pago

### Dummy Payment Method
- **Tipo**: Método de prueba
- **Uso**: Solo para desarrollo/testing
- **Configuración**: En código (`vendure-config.ts`)

**Nota**: En producción se debe reemplazar por Stripe, PayPal o Redsys.

---

## Canal

### Default Channel
- **Nombre**: Default channel
- **Code**: __default_channel__
- **Moneda**: EUR (€)
- **Idioma**: English (por defecto)
- **Default tax zone**: España
- **Default shipping zone**: España
- **Prices include tax**: ✓ Sí

---

## Stock Control

- **Track inventory**: ✓ Activado
- **Out of stock threshold**: 0
- **Allow backorders**: ✗ No permitidos

**Funcionamiento**: El stock se reduce automáticamente al completar un pedido.

---

## Promociones

**Estado**: Pendiente (opcional)

Promoción sugerida:
- **Envío Gratis >500€**: Envío gratuito para pedidos >= 500€

---

## Testing

### Flujo de Compra Completo

1. Obtener productos (GraphQL)
2. Añadir al carrito
3. Configurar dirección de envío
4. Seleccionar método de envío
5. Completar pago (dummy)
6. Verificar pedido en Dashboard
7. Verificar email en mailbox

**Guía de testing**: Ver `testing_checkout.md`

---

## Servicios Disponibles

| Servicio | URL | Estado |
|----------|-----|--------|
| Dashboard | http://localhost:3001/dashboard | ✅ |
| Shop API | http://localhost:3001/shop-api | ✅ |
| Admin API | http://localhost:3001/admin-api | ✅ |
| Mailbox | http://localhost:3001/mailbox | ✅ |

**Credenciales**: `superadmin` / `superadmin`

---

## Próximos Pasos

1. ✅ Configuración básica completada
2. ⏳ Esperar productos de Rama 1
3. ⏳ Testing E2E con productos reales
4. ⏳ Configurar Stripe para producción
5. ⏳ Crear promociones (opcional)

---

## Notas Técnicas

- Precios en céntimos (50€ = 5000)
- IVA incluido en todos los precios mostrados
- Stock tracking automático
- Emails en modo dev (guardados en archivos)
