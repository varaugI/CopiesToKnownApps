import autocannon from 'autocannon';

const targetUrl = process.env.TARGET_URL || 'http://localhost:5000';

async function runLoadTest() {
  console.log(`\n🚀 Starting Autocannon Load Benchmark against: ${targetUrl}\n`);

  const result = await autocannon({
    url: `${targetUrl}/health`,
    connections: 50,
    pipelining: 1,
    duration: 5, // 5 seconds
    title: 'Reddit API High Concurrency Health Benchmark'
  });

  console.log('\n📊 Load Test Results Summary:');
  console.log(`- Total Requests: ${result.requests.total}`);
  console.log(`- Requests / Sec (Average): ${result.requests.average}`);
  console.log(`- Throughput (Bytes / Sec): ${result.throughput.average}`);
  console.log(`- p50 Latency: ${result.latency.p50} ms`);
  console.log(`- p90 Latency: ${result.latency.p90} ms`);
  console.log(`- p99 Latency: ${result.latency.p99} ms`);
  console.log(`- 2xx Success Responses: ${result['2xx']}`);
  console.log(`- Non-2xx Errors: ${result.non2xx}\n`);

  if (result.non2xx > 0) {
    console.warn('⚠️ Warning: Some requests returned non-2xx status codes under stress.');
  } else {
    console.log('✅ PASS: API handled high concurrency with zero errors!');
  }
}

runLoadTest().catch(console.error);
