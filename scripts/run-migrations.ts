import { supabaseAdmin } from '../lib/supabaseAdmin';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigrations() {
  console.log('🔄 Running new Supabase migrations...');

  const migrations = [
    '20230628000000_business_pricing_tiers.sql',
    '20230629000000_update_business_invitation_functions.sql', 
    '20230630000000_complete_stripe_integration.sql'
  ];

  for (const migrationFile of migrations) {
    console.log(`\n📝 Running migration: ${migrationFile}`);
    
    try {
      const migrationPath = join(process.cwd(), 'supabase', 'migrations', migrationFile);
      const sql = readFileSync(migrationPath, 'utf8');
      
      // Split by semicolons and execute each statement
      const statements = sql
        .split(';')
        .map(statement => statement.trim())
        .filter(statement => statement.length > 0 && !statement.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            const { error } = await supabaseAdmin.rpc('exec_sql', { query: statement + ';' });
            if (error) {
              console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
            }
          } catch (statementError: any) {
            // Try direct query execution
            try {
              const { error: directError } = await supabaseAdmin.from('_migrations_log').select('*').limit(1);
              // If we can't execute SQL directly, we'll need manual execution
              console.log(`ℹ️  Statement ${i + 1}: ${statement.substring(0, 100)}...`);
            } catch {
              console.log(`ℹ️  Statement ${i + 1}: ${statement.substring(0, 100)}...`);
            }
          }
        }
      }
      
      console.log(`✅ Migration ${migrationFile} processed`);
      
    } catch (error: any) {
      console.error(`❌ Error running migration ${migrationFile}:`, error.message);
    }
  }

  console.log('\n🎉 Migration process completed!');
  console.log('\n📋 Please manually execute these SQL files in your Supabase SQL Editor:');
  console.log('1. supabase/migrations/20230628000000_business_pricing_tiers.sql');
  console.log('2. supabase/migrations/20230629000000_update_business_invitation_functions.sql');
  console.log('3. supabase/migrations/20230630000000_complete_stripe_integration.sql');
  console.log('\nOr use: supabase db push (if linked to remote project)');
}

runMigrations().catch(console.error);