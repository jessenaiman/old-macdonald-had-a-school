import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

// Essential curriculum lesson planning queries
const curriculumQueries = [
  // Science topics
  {
    category: 'Science',
    query: 'Science: electricity',
    description: 'Find lessons about electricity'
  },
  {
    category: 'Science',
    query: 'weather seasons rain snow',
    description: 'Find lessons about weather and seasons'
  },
  {
    category: 'Science',
    query: 'plants growing seeds garden',
    description: 'Find lessons about plant life cycles'
  },
  
  // Animal themes
  {
    category: 'Animals',
    query: 'Animals: horses',
    description: 'Find lessons featuring horses'
  },
  {
    category: 'Animals',
    query: 'farm animals cow pig chicken',
    description: 'Find farm animal lessons'
  },
  {
    category: 'Animals',
    query: 'ocean animals fish whale dolphin',
    description: 'Find ocean/marine animal lessons'
  },
  {
    category: 'Animals',
    query: 'birds flying nest eggs',
    description: 'Find bird-themed lessons'
  },
  
  // Movement & fingerplays
  {
    category: 'Fingerplays',
    query: 'Fingerplays with ponies',
    description: 'Find pony/horse fingerplays'
  },
  {
    category: 'Fingerplays',
    query: 'fingerplays counting numbers',
    description: 'Find counting fingerplays'
  },
  {
    category: 'Fingerplays',
    query: 'fingerplays body parts hands feet',
    description: 'Find body awareness fingerplays'
  },
  
  // Social-emotional
  {
    category: 'Social-Emotional',
    query: 'feelings emotions happy sad angry',
    description: 'Find emotional literacy content'
  },
  {
    category: 'Social-Emotional',
    query: 'sharing taking turns cooperation',
    description: 'Find social skills content'
  },
  {
    category: 'Social-Emotional',
    query: 'self-regulation calm breathing',
    description: 'Find self-regulation strategies'
  },
  
  // Literacy
  {
    category: 'Literacy',
    query: 'alphabet letters ABC',
    description: 'Find alphabet/letter content'
  },
  {
    category: 'Literacy',
    query: 'rhyming words phonological awareness',
    description: 'Find rhyming/phonological content'
  },
  {
    category: 'Literacy',
    query: 'storytelling narrative sequence',
    description: 'Find storytelling content'
  },
  
  // Math
  {
    category: 'Math',
    query: 'counting numbers 1-10',
    description: 'Find counting content'
  },
  {
    category: 'Math',
    query: 'shapes circle square triangle',
    description: 'Find shape content'
  },
  {
    category: 'Math',
    query: 'patterns sorting categorizing',
    description: 'Find pattern/sorting content'
  },
  
  // Transitions & routines
  {
    category: 'Transitions',
    query: 'hello welcome greeting songs',
    description: 'Find greeting/opening content'
  },
  {
    category: 'Transitions',
    query: 'goodbye farewell closing songs',
    description: 'Find closing content'
  },
  {
    category: 'Transitions',
    query: 'cleanup transition songs',
    description: 'Find transition content'
  },
  
  // Cultural & seasonal
  {
    category: 'Cultural',
    query: 'multicultural diverse traditions',
    description: 'Find multicultural content'
  },
  {
    category: 'Seasonal',
    query: 'autumn fall leaves harvest',
    description: 'Find autumn content'
  },
  {
    category: 'Seasonal',
    query: 'winter snow cold holidays',
    description: 'Find winter content'
  },
  {
    category: 'Seasonal',
    query: 'spring flowers butterflies',
    description: 'Find spring content'
  },
  
  // Age-specific
  {
    category: 'Age-Specific',
    query: 'infant baby lullaby soothing',
    description: 'Find infant-appropriate content'
  },
  {
    category: 'Age-Specific',
    query: 'toddler movement active energetic',
    description: 'Find toddler-appropriate content'
  },
  {
    category: 'Age-Specific',
    query: 'preschool complex narrative',
    description: 'Find preschool-appropriate content'
  }
];

async function generateQueryEmbedding(query) {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  const output = await embedder(query, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

async function runSearch(client, query, queryEmbedding) {
  const start = Date.now();
  const embeddingStr = '[' + queryEmbedding.join(',') + ']';
  
  // Hybrid search: keyword (0.4) + semantic (0.6)
  const result = await client.query(`
    SELECT 
      id,
      kind,
      title,
      source_path,
      LEFT(chunk_text, 200) as snippet,
      ts_rank(tsv, plainto_tsquery('english', $1)) as keyword_score,
      1 - (embedding <=> $2::vector) as semantic_score,
      (0.4 * COALESCE(ts_rank(tsv, plainto_tsquery('english', $1)), 0)) + 
      (0.6 * (1 - (embedding <=> $2::vector))) as combined_score
    FROM search_chunks
    WHERE tsv @@ plainto_tsquery('english', $1)
       OR embedding <=> $2::vector < 0.7
    ORDER BY combined_score DESC
    LIMIT 5
  `, [query, embeddingStr]);
  
  const latency = Date.now() - start;
  return { 
    query, 
    latency, 
    count: result.rows.length,
    results: result.rows
  };
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('=== CURRICULUM QUERY TEST SUITE ===\n');
  console.log(`Testing ${curriculumQueries.length} essential curriculum queries\n`);
  console.log('Loading embedding model...');
  
  const results = [];
  const startTime = Date.now();
  
  for (let i = 0; i < curriculumQueries.length; i++) {
    const testQuery = curriculumQueries[i];
    console.log(`\n[${i + 1}/${curriculumQueries.length}] ${testQuery.category}: ${testQuery.description}`);
    console.log(`  Query: "${testQuery.query}"`);
    
    const queryEmbedding = await generateQueryEmbedding(testQuery.query);
    const result = await runSearch(client, testQuery.query, queryEmbedding);
    
    results.push({
      ...testQuery,
      ...result
    });
    
    if (result.count > 0) {
      console.log(`  ✓ Found ${result.count} results (${result.latency}ms)`);
      console.log(`    Top match: ${result.results[0].title} (score: ${result.results[0].combined_score.toFixed(3)})`);
    } else {
      console.log(`  ✗ No results found (${result.latency}ms)`);
    }
  }
  
  const totalTime = Date.now() - startTime;
  
  // Summary report
  console.log('\n\n=== SUMMARY REPORT ===\n');
  
  const successCount = results.filter(r => r.count > 0).length;
  const avgLatency = Math.round(results.reduce((sum, r) => sum + r.latency, 0) / results.length);
  
  console.log(`Total queries: ${curriculumQueries.length}`);
  console.log(`Successful queries: ${successCount}/${curriculumQueries.length} (${Math.round(successCount/curriculumQueries.length*100)}%)`);
  console.log(`Average latency: ${avgLatency}ms`);
  console.log(`Total time: ${Math.round(totalTime/1000)}s`);
  
  // Breakdown by category
  console.log('\n=== BREAKDOWN BY CATEGORY ===\n');
  
  const categories = [...new Set(curriculumQueries.map(q => q.category))];
  for (const category of categories) {
    const categoryResults = results.filter(r => r.category === category);
    const categorySuccess = categoryResults.filter(r => r.count > 0).length;
    console.log(`${category}: ${categorySuccess}/${categoryResults.length} queries successful`);
  }
  
  // Failed queries
  const failedQueries = results.filter(r => r.count === 0);
  if (failedQueries.length > 0) {
    console.log('\n=== FAILED QUERIES (Need More Data) ===\n');
    failedQueries.forEach(q => {
      console.log(`- ${q.category}: "${q.query}" - ${q.description}`);
    });
  }
  
  // Slow queries (>200ms)
  const slowQueries = results.filter(r => r.latency > 200);
  if (slowQueries.length > 0) {
    console.log('\n=== SLOW QUERIES (>200ms, Need Indexing) ===\n');
    slowQueries.forEach(q => {
      console.log(`- ${q.category}: "${q.query}" - ${q.latency}ms`);
    });
  }
  
  // Save detailed results to JSON
  const reportPath = 'scripts/data/curriculum-query-results.json';
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${reportPath}`);
  
  await client.end();
})();
