import pg from 'pg';
import fs from 'fs';

const DATABASE_URL = fs.readFileSync('.env.local', 'utf-8').match(/^DATABASE_URL=(.+)$/m)[1];

const newFacts = [
  {
    kind: 'knowledge',
    source_path: '02-educators-publishers/pdf/naeyc-beyond-twinkle-twinkle.pdf',
    url: '',
    title: 'Infants discriminate happy vs sad music at 5 months',
    chunk_text: 'One recent study found that babies as young as 5 months old are able, under some conditions, to discriminate between happy and sad musical excerpts (Flom, Gentile, & Pick 2008). This demonstrates that emotional discrimination through music begins very early in development, before language acquisition.',
    meta: {
      fact_type: 'research_finding',
      age_group: 'infants',
      developmental_domain: 'social-emotional',
      researchers: 'Flom, Gentile, & Pick',
      year: 2008,
      pdf_page: 2
    }
  },
  {
    kind: 'knowledge',
    source_path: '02-educators-publishers/pdf/naeyc-beyond-twinkle-twinkle.pdf',
    url: '',
    title: 'Crossing the midline and bilateral coordination',
    chunk_text: 'Crossing the midline—when a child uses one part of the body in the space of the other part—is an activity that requires good bilateral communication. Picture a child playing a drum with both hands, passing a maraca from one hand to the other, dancing the Hokey Pokey (putting one leg in and one leg out). Teachers can also hold an egg shaker in a way that requires babies to reach across their bodies to grab it. Bilateral coordination is the ability to use both sides of the body together, like when climbing stairs or playing a piano. This skill requires both sides of the brain to communicate to coordinate the body\'s movements.',
    meta: {
      fact_type: 'motor_skill_concept',
      age_group: 'infants and toddlers',
      developmental_domain: 'physical-motor',
      pdf_page: 3
    }
  },
  {
    kind: 'knowledge',
    source_path: '01-libraries-agencies/pdf/ohio-ready-to-read-rhyme-with-me.pdf',
    url: '',
    title: 'The Rhyming Problem in early literacy',
    chunk_text: 'The Rhyming Problem is a documented issue in early literacy education. Researchers Laurie J. Harper and Wenonah Faye Gildon have studied challenges with rhyming instruction. The problem appears in the context of the Science of Reading Method (SOR) and its reliance on phonological and phonemic awareness for early literacy development.',
    meta: {
      fact_type: 'educational_challenge',
      age_group: 'preschool and kindergarten',
      developmental_domain: 'language-literacy',
      researchers: 'Laurie J. Harper and Wenonah Faye Gildon',
      pdf_page: 6
    }
  }
];

async function generateEmbedding(text) {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
    quantized: true,
    local_files_only: true
  });
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  return Array.from(output.data);
}

(async () => {
  const client = new pg.Client(DATABASE_URL);
  await client.connect();
  
  console.log('Ingesting 3 new facts from PDFs...\n');
  
  let inserted = 0;
  for (const fact of newFacts) {
    console.log(`Processing: ${fact.title}`);
    
    // Generate embedding
    const embedding = await generateEmbedding(fact.chunk_text);
    const embeddingStr = '[' + embedding.join(',') + ']';
    
    // Insert into database
    const result = await client.query(`
      INSERT INTO search_chunks (kind, source_path, url, title, chunk_text, embedding, meta)
      VALUES ($1, $2, $3, $4, $5, $6::vector, $7)
      RETURNING id
    `, [fact.kind, fact.source_path, fact.url, fact.title, fact.chunk_text, embeddingStr, fact.meta]);
    
    console.log(`  ✓ Inserted (id: ${result.rows[0].id})`);
    inserted++;
  }
  
  console.log(`\n✓ Ingested ${inserted} new facts`);
  
  // Verify
  const count = await client.query('SELECT COUNT(*) FROM search_chunks WHERE kind = $1', ['knowledge']);
  console.log(`\nTotal knowledge chunks in database: ${count.rows[0].count}`);
  
  await client.end();
})();
