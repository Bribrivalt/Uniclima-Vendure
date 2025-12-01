/**
 * Uniclima Vendure - Initial Data Seeding Script
 * 
 * This script creates the initial data structure for the Uniclima e-commerce platform:
 * - 19 Product Categories (from WooCommerce categories)
 * - Brand Facets (from WooCommerce Tags)
 * - Tax categories and rates
 * - Default shipping method
 * - Default channel configuration
 */

import {
    bootstrap,
    ChannelService,
    CollectionService,
    FacetService,
    FacetValueService,
    RequestContext,
    TaxCategoryService,
    TaxRateService,
    ShippingMethodService,
    ZoneService,
    CountryService,
    LanguageCode,
    TransactionalConnection,
    Administrator,
    Role,
    Zone,
    TaxCategory,
    Facet,
    FacetValue,
    Collection,
} from '@vendure/core';
import { config } from './vendure-config';
import 'dotenv/config';

// WooCommerce Categories to migrate
const WOOCOMMERCE_CATEGORIES = [
    'Bombas',
    'Captadores de presión',
    'Detectores de Flujo',
    'Extractores',
    'Hidráulicos',
    'Intercambiador Bitermico',
    'Intercambiador de placas',
    'Llaves de llenado',
    'Manómetros - Acuastatos',
    'Microacumuladores',
    'Placas Electrónicas',
    'Presostatos',
    'Quemadores de gas',
    'Sin categorizar',
    'Termostatos de seguridad',
    'Transformadores',
    'Válvulas',
    'Válvulas de 3 vías',
    'Válvulas de Gas',
    'Vasos de expansión',
];

// WooCommerce Tags (Brands) to migrate
const WOOCOMMERCE_BRANDS = [
    'Saunier Duval',
    'Junkers',
    'Fagor',
    'Ferroli',
    'Roca',
    'Chaffoteaux',
    'Ariston',
    'Hermann',
    'Cointra',
    'Vaillant',
    'Beretta',
    'Biasi',
    'Manaut',
    'Wolf',
    'Airsol',
    'Renova',
    'Wiesberg',
    'Sime',
    'Baxi',
];

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

async function seedData() {
    console.log('🌱 Starting Uniclima data seeding...\n');

    const app = await bootstrap(config);
    
    const connection = app.get(TransactionalConnection);
    const channelService = app.get(ChannelService);
    const collectionService = app.get(CollectionService);
    const facetService = app.get(FacetService);
    const facetValueService = app.get(FacetValueService);
    const taxCategoryService = app.get(TaxCategoryService);
    const taxRateService = app.get(TaxRateService);
    const zoneService = app.get(ZoneService);
    const countryService = app.get(CountryService);

    // Get the default channel
    const defaultChannel = await channelService.getDefaultChannel();
    
    // Create a request context for superadmin operations
    const ctx = new RequestContext({
        apiType: 'admin',
        isAuthorized: true,
        authorizedAsOwnerOnly: false,
        channel: defaultChannel,
        languageCode: LanguageCode.es,
    });

    try {
        // ========================================
        // STEP 1: Create Spain Zone and Country
        // ========================================
        console.log('📍 Setting up zones and countries...');
        
        let spainZone: Zone | undefined;
        const existingZones = await zoneService.findAll(ctx);
        spainZone = existingZones.items.find((z: Zone) => z.name === 'Spain');
        
        if (!spainZone) {
            // Create Spain country first
            const spainCountry = await countryService.create(ctx, {
                code: 'ES',
                translations: [
                    { languageCode: LanguageCode.es, name: 'España' },
                    { languageCode: LanguageCode.en, name: 'Spain' },
                ],
                enabled: true,
            });
            
            // Create Spain zone
            spainZone = await zoneService.create(ctx, {
                name: 'Spain',
                memberIds: [spainCountry.id],
            });
            console.log('  ✅ Created Spain zone and country');
        } else {
            console.log('  ⏭️  Spain zone already exists');
        }

        // Assign Spain zone as the default tax zone for the channel
        console.log('\n🔗 Configuring channel default tax zone...');
        if (!defaultChannel.defaultTaxZone || defaultChannel.defaultTaxZone.id !== spainZone.id) {
            await channelService.update(ctx, {
                id: defaultChannel.id,
                defaultTaxZoneId: spainZone.id,
                defaultShippingZoneId: spainZone.id,
            });
            console.log('  ✅ Assigned Spain as default tax zone for channel');
        } else {
            console.log('  ⏭️  Channel already has Spain as default tax zone');
        }

        // ========================================
        // STEP 2: Create Tax Categories
        // ========================================
        console.log('\n💰 Setting up tax categories...');
        
        const existingTaxCategories = await taxCategoryService.findAll(ctx);
        let standardTaxCategory = existingTaxCategories.items.find((tc: TaxCategory) => tc.name === 'IVA Standard');
        
        if (!standardTaxCategory) {
            standardTaxCategory = await taxCategoryService.create(ctx, {
                name: 'IVA Standard',
                isDefault: true,
            });
            console.log('  ✅ Created IVA Standard tax category');
            
            // Create tax rate for Spain
            await taxRateService.create(ctx, {
                name: 'IVA 21%',
                enabled: true,
                value: 21,
                categoryId: standardTaxCategory.id,
                zoneId: spainZone.id,
            });
            console.log('  ✅ Created IVA 21% tax rate for Spain');
        } else {
            console.log('  ⏭️  Tax categories already exist');
        }

        // ========================================
        // STEP 3: Create Brand Facet and Values
        // ========================================
        console.log('\n🏷️  Creating brand facet...');
        
        const existingFacets = await facetService.findAll(ctx, { take: 100 });
        let brandFacet: Facet | undefined = existingFacets.items.find((f: Facet) => f.code === 'brand');
        
        if (!brandFacet) {
            brandFacet = await facetService.create(ctx, {
                code: 'brand',
                isPrivate: false,
                translations: [
                    { languageCode: LanguageCode.es, name: 'Marca' },
                    { languageCode: LanguageCode.en, name: 'Brand' },
                ],
            });
            console.log('  ✅ Created brand facet');
        } else {
            console.log('  ⏭️  Brand facet already exists');
        }

        // Create brand facet values
        console.log('\n🏷️  Creating brand facet values...');
        const existingFacetValues = await facetValueService.findAll(ctx, LanguageCode.es);
        // facetValueService.findAll returns an array directly in Vendure 3.x
        const facetValuesArray = Array.isArray(existingFacetValues) ? existingFacetValues : (existingFacetValues as any).items || [];
        const existingBrandCodes = new Set(
            facetValuesArray
                .filter((fv: FacetValue) => fv.facet.id === brandFacet!.id)
                .map((fv: FacetValue) => fv.code)
        );

        let brandsCreated = 0;
        for (const brand of WOOCOMMERCE_BRANDS) {
            const brandCode = slugify(brand);
            
            if (!existingBrandCodes.has(brandCode)) {
                await facetValueService.create(ctx, brandFacet, {
                    code: brandCode,
                    translations: [
                        { languageCode: LanguageCode.es, name: brand },
                        { languageCode: LanguageCode.en, name: brand },
                    ],
                });
                brandsCreated++;
                console.log(`  ✅ Created brand: ${brand}`);
            }
        }
        
        if (brandsCreated === 0) {
            console.log('  ⏭️  All brand facet values already exist');
        } else {
            console.log(`  📊 Created ${brandsCreated} brand facet values`);
        }

        // ========================================
        // STEP 4: Create Condition Facet
        // ========================================
        console.log('\n🔄 Creating condition facet...');
        
        let conditionFacet: Facet | undefined = existingFacets.items.find((f: Facet) => f.code === 'condition');
        
        if (!conditionFacet) {
            conditionFacet = await facetService.create(ctx, {
                code: 'condition',
                isPrivate: false,
                translations: [
                    { languageCode: LanguageCode.es, name: 'Estado' },
                    { languageCode: LanguageCode.en, name: 'Condition' },
                ],
            });
            
            // Create condition values
            await facetValueService.create(ctx, conditionFacet, {
                code: 'reacondicionado',
                translations: [
                    { languageCode: LanguageCode.es, name: 'Reacondicionado' },
                    { languageCode: LanguageCode.en, name: 'Refurbished' },
                ],
            });
            
            await facetValueService.create(ctx, conditionFacet, {
                code: 'nuevo',
                translations: [
                    { languageCode: LanguageCode.es, name: 'Nuevo' },
                    { languageCode: LanguageCode.en, name: 'New' },
                ],
            });
            
            console.log('  ✅ Created condition facet with values');
        } else {
            console.log('  ⏭️  Condition facet already exists');
        }

        // ========================================
        // STEP 5: Create Category Collections
        // ========================================
        console.log('\n📁 Creating category collections...');
        
        const existingCollections = await collectionService.findAll(ctx, {
            take: 100,
        });
        const existingCollectionSlugs = new Set(
            existingCollections.items.map((c: Collection) => String(c.slug))
        );

        // First, create a root collection for all products
        let rootCollection: Collection | undefined = existingCollections.items.find((c: Collection) => c.slug === 'todos-los-productos');
        
        if (!rootCollection) {
            rootCollection = await collectionService.create(ctx, {
                translations: [
                    {
                        languageCode: LanguageCode.es,
                        name: 'Todos los Productos',
                        slug: 'todos-los-productos' as any,
                        description: 'Catálogo completo de piezas de repuesto para calderas'
                    },
                    {
                        languageCode: LanguageCode.en,
                        name: 'All Products',
                        slug: 'all-products' as any,
                        description: 'Complete catalog of boiler spare parts'
                    },
                ],
                isPrivate: false,
                filters: [],
            });
            console.log('  ✅ Created root collection: Todos los Productos');
        }

        let collectionsCreated = 0;
        for (const category of WOOCOMMERCE_CATEGORIES) {
            const slug = slugify(category);
            
            if (!existingCollectionSlugs.has(slug)) {
                // Create a collection filter that will be updated when products are imported
                // For now, create with an empty filter - products will be assigned during import
                await collectionService.create(ctx, {
                    parentId: rootCollection.id,
                    translations: [
                        {
                            languageCode: LanguageCode.es,
                            name: category,
                            slug: slug as any,
                            description: `Piezas de repuesto: ${category}`
                        },
                        {
                            languageCode: LanguageCode.en,
                            name: category,
                            slug: `${slug}-en` as any,
                            description: `Spare parts: ${category}`
                        },
                    ],
                    isPrivate: false,
                    filters: [],
                });
                collectionsCreated++;
                console.log(`  ✅ Created collection: ${category}`);
            }
        }
        
        if (collectionsCreated === 0) {
            console.log('  ⏭️  All category collections already exist');
        } else {
            console.log(`  📊 Created ${collectionsCreated} category collections`);
        }

        // ========================================
        // SUMMARY
        // ========================================
        console.log('\n' + '='.repeat(50));
        console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
        console.log('='.repeat(50));
        console.log('\nSummary:');
        console.log(`  📍 Zones: Spain zone configured`);
        console.log(`  💰 Tax: IVA 21% configured`);
        console.log(`  🏷️  Brands: ${WOOCOMMERCE_BRANDS.length} brands available`);
        console.log(`  📁 Categories: ${WOOCOMMERCE_CATEGORIES.length} categories available`);
        console.log(`  🔄 Conditions: Refurbished/New available`);
        console.log('\nNext step: Run the WooCommerce import script:');
        console.log('  npm run import:woocommerce');
        console.log('');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        throw error;
    } finally {
        await app.close();
    }
}

// Run the seed function
seedData()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Fatal error:', err);
        process.exit(1);
    });