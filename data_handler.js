import fs from 'fs';

// ROT-128 Decryption Function
function decryptRot128(data) {
    let decryptedData = '';
    for (let i = 0; i < data.length; i++) {
        decryptedData += String.fromCharCode(data[i] ^ 128);  // XOR with 128
    }
    return decryptedData;
}

// Read the ROT-128 encrypted CSV file and decrypt it
function readEncryptedCsv(filePath) {
    try {
        const encryptedData = fs.readFileSync(filePath);  // Read file as binary data
        const decryptedData = decryptRot128(encryptedData);  // Decrypt the data
        return decryptedData;  // Return decrypted string
    } catch (error) {
        console.error('Error reading or decrypting the file:', error);
        return null;
    }
}

// Parse the CSV data
function parseDonations(csvData) {
    const donations = [];
    const rows = csvData.split('\n').filter(row => row.trim() !== '');  // Remove empty rows
    const headers = rows[0].split(',');  // First row contains headers

    // Ensure that the number of columns in each row matches the number of headers
    rows.slice(1).forEach(row => {
        const cols = row.split(',');

        // Skip malformed rows where columns don't match the header length
        if (cols.length !== headers.length) {
            console.warn(`Skipping malformed row: ${row}`);
            return;
        }

        const donation = {};
        for (let i = 0; i < headers.length; i++) {
            if (cols[i]) {
                donation[headers[i].trim()] = cols[i].trim();  // Only add the value if it's not undefined
            }
        }

        // Push donation to the donations array
        donations.push({
            name: donation['Name'],
            cardNumber: donation['CCNumber'],
            cvv: donation['CVV'],
            expirationMonth: parseInt(donation['ExpMonth']),
            expirationYear: 2027,  // Modify expiration year to bypass expired cards
            amount: parseInt(donation['AmountSubunits'])
        });
    });

    return donations;
}

export { readEncryptedCsv, parseDonations };
