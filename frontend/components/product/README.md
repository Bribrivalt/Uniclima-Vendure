# ProductButton Component

Componente inteligente que renderiza el botón correcto según el campo `modoVenta` del producto.

## Uso

```tsx
import { ProductButton } from '@/components/product/ProductButton';
import { Product } from '@/lib/types/product';

// En tu componente
<ProductButton 
    product={product} 
    variant="primary"
    size="lg"
    fullWidth
/>
```

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `product` | `Product` | ✅ | - | Producto con customFields.modoVenta |
| `variant` | `'primary' \| 'secondary'` | ❌ | `'primary'` | Variante visual del botón |
| `size` | `'sm' \| 'md' \| 'lg'` | ❌ | `'md'` | Tamaño del botón |
| `fullWidth` | `boolean` | ❌ | `false` | Si el botón ocupa todo el ancho |
| `onAddToCart` | `(productId, variantId) => Promise<void>` | ❌ | - | Callback personalizado para añadir al carrito |
| `onRequestQuote` | `(productId) => void` | ❌ | - | Callback personalizado para solicitar presupuesto |

## Modos de Venta

### 1. Compra Directa (`modoVenta: "compra_directa"`)

Para productos que se pueden comprar directamente (repuestos reacondicionados).

**Comportamiento:**
- Muestra botón "Añadir al Carrito" con icono de carrito
- Al hacer click, añade el producto al carrito de Vendure
- Muestra estado de carga mientras procesa
- Muestra feedback visual de éxito (✓ ¡Añadido!)
- El estado de éxito desaparece después de 2 segundos

**Ejemplo de producto:**
```typescript
const producto = {
    id: '1',
    name: 'Compresor Reacondicionado',
    customFields: {
        modoVenta: 'compra_directa'
    },
    variants: [{ id: 'v1', price: 299 }]
};
```

### 2. Solicitar Presupuesto (`modoVenta: "solicitar_presupuesto"`)

Para productos que requieren presupuesto (aires acondicionados, calderas con instalación).

**Comportamiento:**
- Muestra botón "Solicitar Presupuesto" con icono de documento
- Al hacer click, redirige a formulario de presupuesto
- Incluye el slug del producto en la URL: `/presupuesto?producto=slug`

**Ejemplo de producto:**
```typescript
const producto = {
    id: '2',
    name: 'Aire Acondicionado Split 3000 frigorías',
    slug: 'aire-split-3000',
    customFields: {
        modoVenta: 'solicitar_presupuesto'
    }
};
```

## Callbacks Personalizados

### onAddToCart

Permite personalizar la lógica de añadir al carrito:

```tsx
const handleAddToCart = async (productId: string, variantId: string) => {
    // Tu lógica personalizada
    await addToCartMutation({ productId, variantId, quantity: 1 });
    showNotification('Producto añadido al carrito');
};

<ProductButton 
    product={product}
    onAddToCart={handleAddToCart}
/>
```

### onRequestQuote

Permite personalizar la lógica de solicitar presupuesto:

```tsx
const handleRequestQuote = (productId: string) => {
    // Abrir modal personalizado
    openQuoteModal(productId);
};

<ProductButton 
    product={product}
    onRequestQuote={handleRequestQuote}
/>
```

## Integración con Vendure

El componente está preparado para integrarse con las mutations de Vendure:

```typescript
// TODO: Implementar en el callback onAddToCart
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';

const [addItemToOrder] = useMutation(ADD_ITEM_TO_ORDER);

const handleAddToCart = async (productId: string, variantId: string) => {
    await addItemToOrder({
        variables: {
            productVariantId: variantId,
            quantity: 1
        }
    });
};
```

## Estilos

El componente utiliza CSS Modules y hereda los estilos del componente `Button` base. Los estilos específicos incluyen:

- Animación de éxito cuando se añade al carrito
- Efectos hover mejorados
- Iconos SVG inline para mejor rendimiento

## Accesibilidad

- Botones con estados disabled apropiados
- Loading states visuales
- Iconos con significado semántico
- Compatible con navegación por teclado

## Ejemplo Completo

```tsx
import { ProductButton } from '@/components/product/ProductButton';
import { useMutation } from '@apollo/client';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';

export function ProductCard({ product }) {
    const [addItemToOrder] = useMutation(ADD_ITEM_TO_ORDER);

    const handleAddToCart = async (productId, variantId) => {
        await addItemToOrder({
            variables: { productVariantId: variantId, quantity: 1 }
        });
    };

    const handleRequestQuote = (productId) => {
        router.push(`/presupuesto?producto=${product.slug}`);
    };

    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            
            <ProductButton
                product={product}
                variant="primary"
                size="lg"
                fullWidth
                onAddToCart={handleAddToCart}
                onRequestQuote={handleRequestQuote}
            />
        </div>
    );
}
```
