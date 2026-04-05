/**
 * FitHub CRM — Basic API Tests
 * Run: node tests/api.test.js (server must be running on port 3000)
 */

const BASE = 'http://localhost:3000/api';

async function req(method, url, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${url}`, opts);
  return { status: res.status, data: await res.json() };
}

let passed = 0, failed = 0;

function assert(label, condition) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}`);
    failed++;
  }
}

async function run() {
  console.log('\n🏋️  FitHub CRM — API Tests\n');

  // Health
  console.log('▶ Health Check');
  const h = await req('GET', '/health');
  assert('GET /health returns 200', h.status === 200);
  assert('Health status is OK', h.data.status === 'OK');

  // Dashboard
  console.log('\n▶ Dashboard');
  const d = await req('GET', '/dashboard');
  assert('GET /dashboard returns 200', d.status === 200);
  assert('Dashboard has activeMembers', typeof d.data.activeMembers === 'number');

  // Members
  console.log('\n▶ Members');
  const ml = await req('GET', '/members');
  assert('GET /members returns 200', ml.status === 200);
  assert('Members array returned', Array.isArray(ml.data.data));

  const mc = await req('POST', '/members', { name: 'Test User', email: 'test@fithub.in', plan: 'Basic', trainer: 'Arjun Joshi' });
  assert('POST /members creates member', mc.status === 201);
  assert('New member has status Active', mc.data.data?.status === 'Active');

  const newId = mc.data.data?.id;
  if (newId) {
    const mu = await req('PUT', `/members/${newId}`, { plan: 'Premium' });
    assert('PUT /members/:id updates member', mu.status === 200);

    const md = await req('DELETE', `/members/${newId}`);
    assert('DELETE /members/:id removes member', md.status === 200);
  }

  const mf = await req('GET', '/members?status=Active');
  assert('GET /members?status=Active filters correctly', mf.data.data?.every(m => m.status === 'Active'));

  const me = await req('GET', '/members/alerts/expiring?days=7');
  assert('GET /members/alerts/expiring returns list', Array.isArray(me.data.data));

  // Trainers
  console.log('\n▶ Trainers');
  const tl = await req('GET', '/trainers');
  assert('GET /trainers returns 200', tl.status === 200);
  assert('Trainers array returned', Array.isArray(tl.data.data));

  const tc = await req('POST', '/trainers', { name: 'Test Trainer', spec: 'Yoga', avail: 'Part Time' });
  assert('POST /trainers creates trainer', tc.status === 201);

  // Classes
  console.log('\n▶ Classes');
  const cl = await req('GET', '/classes');
  assert('GET /classes returns 200', cl.status === 200);

  const cc = await req('POST', '/classes', { name: 'Test Class', type: 'hiit', day: 'Monday', time: '9:00 AM', trainer: 'Arjun Joshi', capacity: 20 });
  assert('POST /classes creates class', cc.status === 201);

  const cs = await req('GET', '/classes/schedule/weekly');
  assert('GET /classes/schedule/weekly returns grouped schedule', cs.data.data?.Monday !== undefined);

  // Payments
  console.log('\n▶ Payments');
  const pl = await req('GET', '/payments');
  assert('GET /payments returns 200', pl.status === 200);

  const pc = await req('POST', '/payments', { member: 'Test Member', plan: 'Standard', amount: 3500, method: 'UPI' });
  assert('POST /payments records payment', pc.status === 201);
  assert('Payment status defaults to Paid', pc.data.data?.status === 'Paid');

  const pr = await req('GET', '/payments/summary/revenue');
  assert('GET /payments/summary/revenue returns totals', typeof pr.data.data?.totalRevenue === 'number');

  // Notifications
  console.log('\n▶ Notifications');
  const nl = await req('GET', '/notifications');
  assert('GET /notifications returns 200', nl.status === 200);
  assert('Unread count present', typeof nl.data.unreadCount === 'number');

  const nc = await req('POST', '/notifications', { msg: 'Test notification', type: 'info' });
  assert('POST /notifications creates notification', nc.status === 201);

  // Reports
  console.log('\n▶ Reports');
  const rs = await req('GET', '/reports/summary');
  assert('GET /reports/summary returns 200', rs.status === 200);
  assert('Summary has members data', rs.data.data?.members !== undefined);

  const rt = await req('GET', '/reports/revenue-trend');
  assert('GET /reports/revenue-trend returns array', Array.isArray(rt.data.data));

  const rg = await req('GET', '/reports/growth-trend');
  assert('GET /reports/growth-trend returns array', Array.isArray(rg.data.data));

  // Summary
  console.log(`\n${'─'.repeat(40)}`);
  console.log(`✅ Passed: ${passed}   ❌ Failed: ${failed}   Total: ${passed + failed}`);
  console.log(`${'─'.repeat(40)}\n`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('Test runner error:', err.message);
  process.exit(1);
});
