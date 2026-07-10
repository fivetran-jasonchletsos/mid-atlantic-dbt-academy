// Wizard Console scenarios — each is a scripted replay of a real dbt Wizard
// session: a plain-English business question, the tool calls it makes along
// the way (search -> describe -> lineage -> warehouse -> dbt_compile ->
// dbt_run), and what each one returns. These mirror the flow taught in the
// dbt Wizard hands-on lab, using the same fictional company, The Builder Depot.
const WIZARD_SCENARIOS = [
  {
    id: 'inventory',
    label: 'Inventory Misallocation',
    question: '"Why do some stores keep showing inventory variance on Item A?"',
    steps: [
      {
        tool: 'search',
        label: 'search: "inventory misallocation by store"',
        out: 'Found 3 candidate models:\n  stg_inventory__counts (silver)\n  fct_shipments (gold)\n  dim_store (gold)\nAlso found an existing intermediate model: int_store_inventory_daily',
      },
      {
        tool: 'describe',
        label: 'describe: fct_shipments',
        out: 'grain: one row per shipment_id\ncolumns: shipment_id, store_id, item_id, qty_shipped, ship_date\nrow count (dev): 148,203',
      },
      {
        tool: 'lineage',
        label: 'lineage: fct_shipments',
        out: 'upstream:   stg_shipments (silver)  <-  shipments (bronze, Fivetran: NetSuite)\ndownstream: mart_channel_health, mart_store_ops',
      },
      {
        tool: 'warehouse',
        label: 'warehouse: sample rows where qty_shipped <> qty_counted',
        out: '18 stores show >15% variance between qty_shipped and qty_counted for Item A over the trailing 30 days.',
      },
      {
        tool: 'dbt_compile',
        label: 'dbt_compile: inventory_shipment_variance.sql  (preview only — nothing materialized yet)',
        out: 'Compiles clean. Preview: 18 rows\ncolumns: store_id, item_id, qty_shipped, qty_counted, variance_pct\nNo warehouse objects created.',
      },
      {
        tool: 'dbt_run',
        label: 'dbt_run --select inventory_shipment_variance  (you approved the preview)',
        out: 'Materialized inventory_shipment_variance as a view in dbt_demo_dev.\n1 model, 0 errors, 0.8s',
        final: true,
      },
    ],
  },
  {
    id: 'channel-health',
    label: 'Channel Health Check',
    question: '"Which sales channels are converting worse than last month?"',
    steps: [
      {
        tool: 'search',
        label: 'search: "channel conversion rate trend"',
        out: 'Found 2 candidate models:\n  mart_channel_health (gold)\n  fct_orders (gold)\nNo existing model computes month-over-month conversion delta.',
      },
      {
        tool: 'describe',
        label: 'describe: mart_channel_health',
        out: 'grain: one row per channel_id per day\ncolumns: channel_id, order_date, sessions, orders, conversion_rate\nrow count (dev): 26,140',
      },
      {
        tool: 'lineage',
        label: 'lineage: mart_channel_health',
        out: 'upstream:   fct_orders, dim_channel (gold)  <-  stg_orders, stg_sessions (silver)  <-  orders, web_sessions (bronze, Fivetran: Shopify, Segment)',
      },
      {
        tool: 'warehouse',
        label: 'warehouse: sample this-month vs. last-month conversion_rate by channel_id',
        out: 'Paid Social: 3.1% -> 2.4% (-23%)\nOrganic:     4.6% -> 4.5% (-2%)\nEmail:       5.8% -> 6.1% (+5%)',
      },
      {
        tool: 'dbt_compile',
        label: 'dbt_compile: channel_conversion_mom.sql  (preview only — nothing materialized yet)',
        out: 'Compiles clean. Preview: 6 rows\ncolumns: channel_id, conversion_rate_curr, conversion_rate_prior, delta_pct\nNo warehouse objects created.',
      },
      {
        tool: 'dbt_run',
        label: 'dbt_run --select channel_conversion_mom  (you approved the preview)',
        out: 'Materialized channel_conversion_mom as a view in dbt_demo_dev.\n1 model, 0 errors, 0.6s',
        final: true,
      },
    ],
  },
];
