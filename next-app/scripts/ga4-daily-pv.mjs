// GA4 Data API で日毎のページビュー数を取得して表示する
//
// 事前準備:
//   1. next-app/docs/GA4-DATA-API-SETUP.md の手順でサービスアカウントを作成し、
//      GA4プロパティに「閲覧者」権限で追加する
//   2. .env.local に GA4_PROPERTY_ID と GOOGLE_APPLICATION_CREDENTIALS を設定
//   3. npm install @google-analytics/data
//
// 実行例:
//   node scripts/ga4-daily-pv.mjs --start 2026-09-01 --end today
//   node scripts/ga4-daily-pv.mjs --start 7daysAgo --end today

import { BetaAnalyticsDataClient } from '@google-analytics/data';

function parseArgs(argv) {
  const args = { start: '2026-09-01', end: 'today' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--start') args.start = argv[++i];
    if (argv[i] === '--end') args.end = argv[++i];
  }
  return args;
}

async function main() {
  const propertyId = process.env.GA4_PROPERTY_ID;
  if (!propertyId) {
    console.error('GA4_PROPERTY_ID が未設定です（.env.local を確認してください）');
    process.exit(1);
  }

  const { start, end } = parseArgs(process.argv.slice(2));
  const client = new BetaAnalyticsDataClient();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [{ startDate: start, endDate: end }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  const rows = response.rows ?? [];
  if (rows.length === 0) {
    console.log('データがありません');
    return;
  }

  console.log('date\tpageviews');
  let total = 0;
  for (const row of rows) {
    const date = row.dimensionValues[0].value; // YYYYMMDD
    const pv = Number(row.metricValues[0].value);
    total += pv;
    const formatted = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    console.log(`${formatted}\t${pv}`);
  }
  console.log(`\ntotal\t${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
