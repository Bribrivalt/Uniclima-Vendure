import { NextRequest, NextResponse } from 'next/server';

/**
 * Interface para la solicitud de presupuesto
 */
interface QuoteRequest {
    nombre: string;
    email: string;
    telefono: string;
    comentario: string;
    productoId: string;
    productoNombre: string;
}

/**
 * Validar formato de email
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Sanitizar string (escapar HTML)
 */
function sanitizeString(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

/**
 * Validar datos de la solicitud
 */
function validateQuoteRequest(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validar nombre
    if (!data.nombre || typeof data.nombre !== 'string') {
        errors.push('El nombre es requerido');
    } else if (data.nombre.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    } else if (data.nombre.length > 100) {
        errors.push('El nombre no puede exceder 100 caracteres');
    }

    // Validar email
    if (!data.email || typeof data.email !== 'string') {
        errors.push('El email es requerido');
    } else if (!isValidEmail(data.email)) {
        errors.push('El formato del email no es válido');
    }

    // Validar teléfono
    if (!data.telefono || typeof data.telefono !== 'string') {
        errors.push('El teléfono es requerido');
    } else if (data.telefono.trim().length < 9) {
        errors.push('El teléfono debe tener al menos 9 caracteres');
    } else if (data.telefono.length > 20) {
        errors.push('El teléfono no puede exceder 20 caracteres');
    }

    // Validar comentario
    if (data.comentario && typeof data.comentario === 'string') {
        if (data.comentario.length > 1000) {
            errors.push('El comentario no puede exceder 1000 caracteres');
        }
    }

    // Validar productoId
    if (!data.productoId || typeof data.productoId !== 'string') {
        errors.push('El ID del producto es requerido');
    }

    // Validar productoNombre
    if (!data.productoNombre || typeof data.productoNombre !== 'string') {
        errors.push('El nombre del producto es requerido');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * POST /api/presupuesto
 * 
 * Endpoint para recibir solicitudes de presupuesto
 */
export async function POST(request: NextRequest) {
    try {
        // Parsear body
        const body = await request.json();

        // Validar datos
        const validation = validateQuoteRequest(body);
        if (!validation.valid) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Datos inválidos',
                    details: validation.errors,
                },
                { status: 400 }
            );
        }

        // Sanitizar datos
        const quoteRequest: QuoteRequest = {
            nombre: sanitizeString(body.nombre.trim()),
            email: body.email.trim().toLowerCase(),
            telefono: sanitizeString(body.telefono.trim()),
            comentario: body.comentario ? sanitizeString(body.comentario.trim()) : '',
            productoId: sanitizeString(body.productoId),
            productoNombre: sanitizeString(body.productoNombre),
        };

        // Log de la solicitud (para desarrollo)
        console.log('📧 Nueva solicitud de presupuesto recibida:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Producto: ${quoteRequest.productoNombre}`);
        console.log(`ID: ${quoteRequest.productoId}`);
        console.log(`Cliente: ${quoteRequest.nombre}`);
        console.log(`Email: ${quoteRequest.email}`);
        console.log(`Teléfono: ${quoteRequest.telefono}`);
        console.log(`Comentario: ${quoteRequest.comentario || '(sin comentarios)'}`);
        console.log(`Fecha: ${new Date().toLocaleString('es-ES')}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // TODO: Aquí se puede agregar:
        // - Envío de email al equipo de ventas
        // - Envío de confirmación al cliente
        // - Guardar en base de datos
        // - Integración con CRM

        // Respuesta exitosa
        return NextResponse.json(
            {
                success: true,
                message: 'Solicitud de presupuesto recibida correctamente. Nos pondremos en contacto contigo pronto.',
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error procesando solicitud de presupuesto:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Error interno del servidor. Por favor, intenta de nuevo más tarde.',
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/presupuesto
 * 
 * Método no permitido - solo aceptamos POST
 */
export async function GET() {
    return NextResponse.json(
        {
            success: false,
            error: 'Método no permitido. Usa POST para enviar solicitudes de presupuesto.',
        },
        { status: 405 }
    );
}
