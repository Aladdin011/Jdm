import ftp from 'basic-ftp'

async function ftpsTest() {
  const client = new ftp.Client()
  client.ftp.verbose = true

  try {
    console.log('🔒 Testing FTPS (Secure FTP)...')
    
    const config = {
      host: '46.202.183.111',
      user: 'u158969833.jdmarcng.com',
      password: 'Error@404',
      port: 21,
      secure: 'implicit' // Try implicit FTPS
    }

    console.log('📡 Connecting with implicit FTPS...')
    await client.access(config)
    
    console.log('✅ FTPS SUCCESS!')
    
  } catch (err) {
    console.error('❌ Implicit FTPS Failed:', err.message)
    
    try {
      console.log('\n🔒 Trying explicit FTPS with certificate ignore...')
      
      const config2 = {
        host: '46.202.183.111',
        user: 'u158969833.jdmarcng.com',
        password: 'Error@404',
        port: 21,
        secure: 'explicit',
        secureOptions: {
          rejectUnauthorized: false
        }
      }

      await client.access(config2)
      console.log('✅ Explicit FTPS SUCCESS!')
      
    } catch (err2) {
      console.error('❌ Explicit FTPS Failed:', err2.message)
      console.log('\n💡 All FTP methods failed. Please:')
      console.log('1. Verify your FTP credentials in Hostinger')
      console.log('2. Try using FileZilla or similar FTP client')
      console.log('3. Contact Hostinger support')
    }
  }

  client.close()
}

ftpsTest()