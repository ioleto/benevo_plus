const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const baseline = '20261021120000_initial';
(async () => {
  try {
    const migrationTable = await prisma.$queryRawUnsafe(`SELECT to_regclass('public._prisma_migrations') AS name`);
    if (migrationTable[0]?.name) process.exit(0);
    const tables = await prisma.$queryRawUnsafe(`SELECT COUNT(*)::int AS count FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('User','Account','Session','Community','Need')`);
    if (tables[0]?.count > 0) {
      console.log(`[benevo+] Base existante détectée: marquage de ${baseline} comme appliquée.`);
      const { spawnSync } = require('child_process');
      const result = spawnSync(process.execPath, ['/app/node_modules/prisma/build/index.js', 'migrate', 'resolve', '--applied', baseline], { stdio: 'inherit' });
      if (result.status !== 0) process.exit(result.status || 1);
    }
  } finally { await prisma.$disconnect(); }
})().catch((error) => { console.error('[benevo+] Échec du baselining:', error); process.exit(1); });
