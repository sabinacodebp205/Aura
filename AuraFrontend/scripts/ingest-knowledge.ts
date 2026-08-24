import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// 1. Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || ''; // Use service_role key for inserting

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Initialize OpenAI (using fetch directly to avoid heavy dependency if preferred, or use openai package)
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  console.error("Missing OPENAI_API_KEY in environment variables.");
  process.exit(1);
}

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      input: text,
      model: "text-embedding-3-small"
    })
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to get embedding: ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// 3. Chunking logic (simple split by double newlines for markdown)
function chunkText(text: string, maxTokens: number = 500): string[] {
  // A very basic chunker based on paragraphs.
  const paragraphs = text.split('\n\n');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const p of paragraphs) {
    // Rough estimate: 4 chars per token
    if ((currentChunk.length + p.length) / 4 > maxTokens) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = p + '\n\n';
    } else {
      currentChunk += p + '\n\n';
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

// 4. Main script
async function main() {
  const contentDir = path.join(process.cwd(), 'content/faq');
  
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory not found: ${contentDir}`);
    fs.mkdirSync(contentDir, { recursive: true });
    console.log("Created directory. Please add markdown files and run again.");
    return;
  }

  const files = fs.readdirSync(contentDir).filter((f: string) => f.endsWith('.md'));
  
  console.log(`Found ${files.length} markdown files to ingest.`);

  for (const file of files) {
    console.log(`Processing ${file}...`);
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    const chunks = chunkText(content);
    console.log(`  Split into ${chunks.length} chunks.`);

    for (const chunk of chunks) {
      try {
        const embedding = await getEmbedding(chunk);
        
        const { error } = await supabase.from('knowledge_chunks').insert({
          content: chunk,
          embedding: embedding,
          source: file,
          metadata: { timestamp: new Date().toISOString() }
        });

        if (error) {
          console.error(`  Error inserting chunk into Supabase: ${error.message}`);
        }
      } catch (err) {
        console.error(`  Failed to process chunk:`, err);
      }
    }
  }

  console.log("Ingestion complete!");
}

main().catch(console.error);
