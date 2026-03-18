import { neon } from '@neondatabase/serverless'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
require('dotenv').config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL)

const MOCK_PRODUCTS = [
  {
    id: 'clmock000001',
    slug: 'blazer-oversize-negro',
    name: 'Blazer Oversize',
    description: 'Blazer de corte oversize en paño italiano. Solapa ancha, dos botones, bolsillos de vivo. Forro interior en seda natural. Una pieza atemporal que trasciende temporadas.',
    price: 89900,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4e5b?w=800&q=80',
    category: 'Sacos',
  },
  {
    id: 'clmock000002',
    slug: 'camisa-lino-blanca',
    name: 'Camisa de Lino',
    description: 'Camisa de lino lavado de alta gramaje. Cuello italiano, botones de nácar, puños sencillos. Ligeramente oversized para un porte relajado.',
    price: 42500,
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
    category: 'Camisas',
  },
  {
    id: 'clmock000003',
    slug: 'pantalon-pinzas-camel',
    name: 'Pantalón de Pinzas',
    description: 'Pantalón de tiro alto con doble pinza. Confeccionado en gabardina de lana fría. Corte recto con ligero acampanado. Bolsillos laterales y trasero con botón.',
    price: 67000,
    imageUrl: 'https://images.unsplash.com/photo-1594938374182-a57b20a41c84?w=800&q=80',
    category: 'Sacos',
  },
  {
    id: 'clmock000004',
    slug: 'trench-clasico-beige',
    name: 'Trench Clásico',
    description: 'Trench en algodón gabardina con acabado impermeable. Cinturón regulable, hombreras sutiles, doble fila de botones dorados. El icono de temporada.',
    price: 124000,
    imageUrl: 'https://images.unsplash.com/photo-1539533018257-7c082b71ee17?w=800&q=80',
    category: 'Camisas',
  },
]

async function seed() {
  console.log('Seeding mock products...')

  for (const p of MOCK_PRODUCTS) {
    await sql`
      INSERT INTO "Product" (id, slug, name, description, price, "imageUrl", category, active, "createdAt", "updatedAt")
      VALUES (
        ${p.id},
        ${p.slug},
        ${p.name},
        ${p.description},
        ${p.price},
        ${p.imageUrl},
        ${p.category},
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        name        = EXCLUDED.name,
        description = EXCLUDED.description,
        price       = EXCLUDED.price,
        "imageUrl"  = EXCLUDED."imageUrl",
        category    = EXCLUDED.category,
        "updatedAt" = NOW()
    `
    console.log(`  ✓ ${p.name} (${p.slug})`)
  }

  console.log('Done.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
