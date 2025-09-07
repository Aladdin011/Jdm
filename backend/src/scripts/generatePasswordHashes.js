const bcrypt = require('bcrypt');

const passwords = [
    { label: 'Admin@123', password: 'Admin@123' },
    { label: 'Acc@123', password: 'Acc@123' },
    { label: 'Acct@123', password: 'Acct@123' },
    { label: 'BA@123', password: 'BA@123' },
    { label: 'BD@123', password: 'BD@123' },
    { label: 'Mkt@123', password: 'Mkt@123' },
    { label: 'Hr@123', password: 'Hr@123' },
    { label: 'Proj@123', password: 'Proj@123' },
    { label: 'Sec@123', password: 'Sec@123' },
    { label: 'Gen@123', password: 'Gen@123' }
];

async function generateHashes() {
    console.log('Generating bcrypt hashes for department passwords...\n');
    
    for (const item of passwords) {
        const hash = await bcrypt.hash(item.password, 10);
        console.log(`${item.label} -> ${hash}`);
    }
}

generateHashes().catch(console.error);
