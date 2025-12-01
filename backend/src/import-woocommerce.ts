/**
 * Uniclima Vendure - WooCommerce Product Import Script
 * 
 * This script imports products from a WooCommerce CSV export file into Vendure.
 * It maps WooCommerce fields to Vendure entities including:
 * - Products with variants
 * - Category assignments (Collections)
 * - Brand assignments (Facet values)
 * - Stock levels
 * - Prices
 */

import {
    bootstrap,
    ChannelService,
    CollectionService,
    FacetService,
    FacetValueService,
    ProductService,
    ProductVariantService,
    RequestContext,
    LanguageCode,
    TransactionalConnection,
    TaxCategoryService,
    Facet,
    FacetValue,
    Collection,
    TaxCategory,
    ID,
    StockLocationService,
    StockLevelService,
} from '@vendure/core';
import { config } from './vendure-config';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// CSV column mapping based on WooCommerce export
interface WooCommerceProduct {
    ID: string;
    Tipo: string;
    SKU: string;
    'GTIN, UPC, EAN o ISBN': string;
    Nombre: string;
    Publicado: string;
    '¿Está destacado?': string;
    'Visibilidad en el catálogo': string;
    'Descripción corta': string;
    Descripción: string;
    'Estado del impuesto': string;
    '¿Existencias?': string;
    Inventario: string;
    'Precio rebajado': string;
    'Precio normal': string;
    Categorías: string;
    Etiquetas: string;
    Imágenes: string;
}

// Utility function to create a slug from a name
function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)+/g, '');       // Remove leading/trailing hyphens
}

// Parse price string (handles European format with comma as decimal separator)
function parsePrice(priceStr: string): number {
    if (!priceStr || priceStr.trim() === '') return 0;
    // Replace comma with dot for decimal
    const normalized = priceStr.replace(',', '.').replace(/[^\d.]/g, '');
    const price = parseFloat(normalized);
    return isNaN(price) ? 0 : Math.round(price * 100); // Convert to cents
}

// Parse stock quantity
function parseStock(stockStr: string): number {
    if (!stockStr || stockStr.trim() === '') return 0;
    const stock = parseInt(stockStr, 10);
    return isNaN(stock) ? 0 : stock;
}

// Clean HTML from description
function cleanDescription(html: string): string {
    if (!html) return '';
    return html
        .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
        .replace(/&nbsp;/g, ' ')   // Replace &nbsp;
        .replace(/\s+/g, ' ')      // Normalize whitespace
        .trim();
}

async function importWooCommerceProducts() {
    console.log('📦 Starting WooCommerce product import...\n');
    
    // Find the CSV file
    const csvPath = path.join(__dirname, '../wc-product-export-21-10-2025-1761058596448.csv');
    
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV file not found at: ${csvPath}`);
        console.error('Please ensure the WooCommerce export file is in the project root directory.');
        process.exit(1);
    }
    
    console.log(`📄 Reading CSV from: ${csvPath}\n`);

    const app = await bootstrap(config);
    
    const channelService = app.get(ChannelService);
    const collectionService = app.get(CollectionService);
    const facetService = app.get(FacetService);
    const facetValueService = app.get(FacetValueService);
    const productService = app.get(ProductService);
    const productVariantService = app.get(ProductVariantService);
    const taxCategoryService = app.get(TaxCategoryService);
    const stockLocationService = app.get(StockLocationService);

    // Get the default channel
    const defaultChannel = await channelService.getDefaultChannel();
    
    // Create a request context for admin operations
    const ctx = new RequestContext({
        apiType: 'admin',
        isAuthorized: true,
        authorizedAsOwnerOnly: false,
        channel: defaultChannel,
        languageCode: LanguageCode.es,
    });

    try {
        // ========================================
        // STEP 1: Load existing data
        // ========================================
        console.log('🔍 Loading existing data...');
        
        // Get brand facet and values
        const existingFacets = await facetService.findAll(ctx, { take: 100 });
        const brandFacet = existingFacets.items.find((f: Facet) => f.code === 'brand');
        const conditionFacet = existingFacets.items.find((f: Facet) => f.code === 'condition');
        
        if (!brandFacet) {
            console.error('❌ Brand facet not found. Please run the seed script first: npm run seed');
            process.exit(1);
        }
        
        // Get all facet values
        const allFacetValues = await facetValueService.findAll(ctx, LanguageCode.es);
        const brandValues = new Map<string, FacetValue>();
        const conditionValues = new Map<string, FacetValue>();
        
        // facetValueService.findAll returns an array directly
        const facetValuesArray = Array.isArray(allFacetValues) ? allFacetValues : (allFacetValues as any).items || [];
        for (const fv of facetValuesArray as FacetValue[]) {
            if (fv.facet.id === brandFacet.id) {
                brandValues.set(slugify(fv.name), fv);
            }
            if (conditionFacet && fv.facet.id === conditionFacet.id) {
                conditionValues.set(fv.code, fv);
            }
        }
        
        console.log(`  ✅ Found ${brandValues.size} brand facet values`);
        
        // Get all collections
        const existingCollections = await collectionService.findAll(ctx, { take: 100 });
        const collectionMap = new Map<string, Collection>();
        
        for (const collection of existingCollections.items as Collection[]) {
            collectionMap.set(collection.slug, collection);
        }
        
        console.log(`  ✅ Found ${collectionMap.size} collections`);
        
        // Get default tax category
        const taxCategories = await taxCategoryService.findAll(ctx);
        const defaultTaxCategory = taxCategories.items.find((tc: TaxCategory) => tc.isDefault) || taxCategories.items[0];
        
        if (!defaultTaxCategory) {
            console.error('❌ No tax category found. Please run the seed script first: npm run seed');
            process.exit(1);
        }
        
        console.log(`  ✅ Using tax category: ${defaultTaxCategory.name}`);
        
        // Get default stock location
        const stockLocations = await stockLocationService.findAll(ctx);
        let defaultStockLocation = stockLocations.items[0];
        
        if (!defaultStockLocation) {
            // Create default stock location
            defaultStockLocation = await stockLocationService.create(ctx, {
                name: 'Almacén Principal',
                description: 'Almacén principal de Uniclima',
            });
            console.log('  ✅ Created default stock location');
        }
        
        // ========================================
        // STEP 2: Parse CSV file
        // ========================================
        console.log('\n📊 Parsing CSV file...');
        
        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        
        const records: WooCommerceProduct[] = await new Promise((resolve, reject) => {
            parse(csvContent, {
                columns: true,
                skip_empty_lines: true,
                bom: true, // Handle BOM character
                delimiter: ',',
                relax_column_count: true,
            }, (err: Error | undefined, data: WooCommerceProduct[]) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
        
        console.log(`  ✅ Found ${records.length} products in CSV\n`);
        
        // ========================================
        // STEP 3: Import products
        // ========================================
        console.log('🚀 Importing products...\n');
        
        let imported = 0;
        let skipped = 0;
        let errors = 0;
        
        for (const record of records) {
            try {
                // Skip if no SKU or name
                if (!record.SKU || !record.Nombre) {
                    console.log(`  ⏭️  Skipping product without SKU/name: ${record.ID}`);
                    skipped++;
                    continue;
                }
                
                // Check if product already exists
                const existingProducts = await productService.findAll(ctx, {
                    filter: {
                        slug: { eq: slugify(record.Nombre) }
                    }
                });
                
                if (existingProducts.totalItems > 0) {
                    console.log(`  ⏭️  Product already exists: ${record.SKU}`);
                    skipped++;
                    continue;
                }
                
                // Parse category
                const categoryName = record.Categorías?.split(',')[0]?.trim() || 'Sin categorizar';
                const categorySlug = slugify(categoryName);
                const collection = collectionMap.get(categorySlug);
                
                // Parse brand from tags
                const brandTag = record.Etiquetas?.trim() || '';
                const brandSlug = slugify(brandTag);
                const brandValue = brandValues.get(brandSlug);
                
                // Get condition facet value (default to refurbished since most products are)
                const conditionValue = conditionValues.get('reacondicionado');
                
                // Build facet value IDs
                const facetValueIds: ID[] = [];
                if (brandValue) facetValueIds.push(brandValue.id);
                if (conditionValue) facetValueIds.push(conditionValue.id);
                
                // Parse price
                const price = parsePrice(record['Precio normal']) || parsePrice(record['Precio rebajado']);
                
                // Parse stock
                const stock = parseStock(record.Inventario);
                
                // Clean description
                const description = cleanDescription(record.Descripción) || cleanDescription(record['Descripción corta']) || '';
                
                // Create product
                const product = await productService.create(ctx, {
                    enabled: record.Publicado === '1',
                    translations: [
                        {
                            languageCode: LanguageCode.es,
                            name: record.Nombre,
                            slug: slugify(record.Nombre),
                            description: description,
                        },
                    ],
                    facetValueIds: facetValueIds,
                });
                
                // Create product variant
                await productVariantService.create(ctx, [
                    {
                        productId: product.id,
                        sku: record.SKU,
                        price: price,
                        taxCategoryId: defaultTaxCategory.id,
                        stockOnHand: stock,
                        trackInventory: 'TRUE' as any,
                        translations: [
                            {
                                languageCode: LanguageCode.es,
                                name: record.Nombre,
                            },
                        ],
                    },
                ]);
                
                // Assign to collection if found
                // Note: Products are assigned to collections via filters in Vendure 3.x
                // You can update the collection's filter to include this product
                if (collection) {
                    // In Vendure 3.x, collections use filters. For manual assignment,
                    // we'd need to update the product's facet values that the collection filters on.
                    // The collection filter approach is preferred for scalability.
                    console.log(`    📁 Product ${record.SKU} should be in collection: ${collection.slug}`);
                }
                
                imported++;
                
                // Log progress every 10 products
                if (imported % 10 === 0) {
                    console.log(`  📦 Imported ${imported} products...`);
                }
                
            } catch (err) {
                console.error(`  ❌ Error importing product ${record.SKU}: ${(err as Error).message}`);
                errors++;
            }
        }
        
        // ========================================
        // SUMMARY
        // ========================================
        console.log('\n' + '='.repeat(50));
        console.log('🎉 IMPORT COMPLETED!');
        console.log('='.repeat(50));
        console.log('\nSummary:');
        console.log(`  ✅ Imported: ${imported} products`);
        console.log(`  ⏭️  Skipped: ${skipped} products`);
        console.log(`  ❌ Errors: ${errors} products`);
        console.log(`  📊 Total processed: ${records.length} products`);
        console.log('\nYou can now access the Vendure admin at:');
        console.log('  http://localhost:3000/admin');
        console.log('');

    } catch (error) {
        console.error('❌ Fatal error during import:', error);
        throw error;
    } finally {
        await app.close();
    }
}

// Run the import function
importWooCommerceProducts()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal error:', err);
        process.exit(1);
    });