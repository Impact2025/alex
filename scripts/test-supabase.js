/**
 * Test Supabase Connection
 * Run: node scripts/test-supabase.js
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://gdtqrpkoocyqoeikwumq.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdHFycGtvb2N5cW9laWt3dW1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MTQzNTYsImV4cCI6MjA3NTA5MDM1Nn0.R8XnzTW2upcPiAEpkm3bHCM6ZjquOf-y87o7ZhWpe1M'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')

  // Test 1: Check connection
  console.log('1️⃣ Testing API connection...')
  try {
    const { error } = await supabase.from('user_points').select('count')
    if (error) {
      console.log('❌ Table "user_points" not found or not accessible')
      console.log('   Error:', error.message)
      console.log('\n💡 You need to run the SQL setup script!')
      console.log('   File: supabase_setup.sql')
      console.log('   Dashboard: https://supabase.com/dashboard/project/gdtqrpkoocyqoeikwumq/sql')
    } else {
      console.log('✅ Table "user_points" exists and is accessible')
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message)
  }

  // Test 2: Check auth
  console.log('\n2️⃣ Testing Authentication...')
  try {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
      console.log('❌ Auth error:', error.message)
    } else {
      console.log('✅ Auth is configured correctly')
      console.log('   Session:', data.session ? 'Active' : 'No active session')
    }
  } catch (err) {
    console.log('❌ Auth test failed:', err.message)
  }

  // Test 3: Check all tables
  console.log('\n3️⃣ Checking required tables...')
  const tables = ['user_points', 'daily_entries', 'match_day_entries']

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`   ❌ ${table} - NOT FOUND`)
      } else {
        console.log(`   ✅ ${table} - OK`)
      }
    } catch (err) {
      console.log(`   ❌ ${table} - ERROR:`, err.message)
    }
  }

  console.log('\n📊 Test Complete!\n')
}

testConnection()
