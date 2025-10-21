#!/usr/bin/env node
// Upload a small test file to Supabase storage using the service role key and print a signed URL.
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const SERVICE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const BUCKET = process.env.SUPABASE_TEST_BUCKET || 'project_files'

if (!SERVICE_URL || !SERVICE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env before running this script')
  process.exit(1)
}

const supabase = createClient(SERVICE_URL, SERVICE_KEY, {
  auth: { persistSession: false }
})

async function run() {
  const testFilePath = path.join(__dirname, 'supabase-test-file.txt')
  fs.writeFileSync(testFilePath, 'supabase test ' + new Date().toISOString())

  const fileName = `tests/supabase-test-${Date.now()}.txt`
  const file = fs.createReadStream(testFilePath)

  console.log('Uploading to bucket', BUCKET, 'as', fileName)
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (uploadError) {
    console.error('Upload failed:', uploadError.message || uploadError)
    process.exit(2)
  }

  const { data: signed, error: signError } = await supabase.storage.from(BUCKET).createSignedUrl(fileName, 60 * 60)
  if (signError) {
    console.error('Signed URL failed:', signError.message || signError)
    process.exit(3)
  }

  console.log('Signed URL:', signed.signedUrl)
  console.log('Done')
}

run().catch(err => {
  console.error(err)
  process.exit(99)
})
