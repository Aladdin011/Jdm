import ftp from 'basic-ftp'

async function simpleTest() {
  const client = new ftp.Client()
  client.ftp.verbose = true

  try {
    console.log('🧪 Simple FTP Test...')
    
    const config = {
      host: '46.202.183.111',
      user: 'u158969833.jdmarcng.com',
      password: 'Error@404',
      port: 21,
      secure: false
    }

    console.log('📡 Connecting...')
    await client.access(config)
    
    console.log('✅ SUCCESS!')
    
  } catch (err) {
    console.error('❌ Failed:', err.message)
    console.log('\n💡 Possible solutions:')
    console.log('1. Check if the password is correct')
    console.log('2. Try using FTPS (secure FTP)')
    console.log('3. Contact Hostinger support')
    console.log('4. Try using FileZilla or similar FTP client to test')
  }

  client.close()
}

simpleTest()