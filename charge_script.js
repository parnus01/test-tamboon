import fs from 'fs';
import { readEncryptedCsv, parseDonations } from './data_handler.js';
import OmiseService from './service/omise.js';

async function processDonations(filePath) {
    const encryptedCsv = readEncryptedCsv(filePath);
    if (!encryptedCsv) {
        console.log("Failed to decrypt the file.");
        return;
    }

    const donations = parseDonations(encryptedCsv);
    let totalReceived = 0;
    let successfullyDonated = 0;
    let faultyDonations = 0;
    let donors = [];

    const batchSize = 5; // Set batch size for processing donations in parallel
    let batchStart = 0;

    const omiseService = new OmiseService();

    while (batchStart < donations.length) {
        const batch = donations.slice(batchStart, batchStart + batchSize);
        const donationPromises = batch.map(async (donation) => {
            const cardData = {
                name: donation.name,
                number: donation.cardNumber,
                expiration_month: donation.expirationMonth,
                expiration_year: 2027,
                security_code: donation.cvv
            };

            try {
                totalReceived += donation.amount;
                const tokenId = await omiseService.createToken(cardData);
                if (tokenId) {
                    const charge = await omiseService.createCharge(tokenId, donation.amount);
                    if (charge && charge.paid) {
                        successfullyDonated += donation.amount;
                        donors.push(donation.name);
                    } else {
                        faultyDonations += donation.amount;
                    }
                } else {
                    faultyDonations += donation.amount;
                }
            } catch (error) {
                console.error('Error processing donation:', error);
                faultyDonations += donation.amount;
            }
        });

        // Wait for the current batch of donations to be processed before moving to the next
        await Promise.all(donationPromises);

        // Wait for 1 second before processing the next batch
        console.log(`Processed batch of ${batchSize} donations.`);
        await delay(1000); //avoid rate limit

        // Move to the next batch
        batchStart += batchSize;
    }

    console.log("\nPerforming donations...\nDone.\n");
    console.log(`    Total received: THB ${totalReceived / 100}`);
    console.log(`Successfully donated: THB ${successfullyDonated / 100}`);
    console.log(`    Faulty donation: THB ${faultyDonations / 100}`);

    if (successfullyDonated > 0) {
        const averagePerPerson = successfullyDonated / donors.length;
        console.log(`\n    Average per person: THB ${averagePerPerson / 100}`);
        const topDonors = donors.slice(0, 3);
        console.log("\n    Top donors:");
        topDonors.forEach(donor => console.log(`        ${donor}`));
    }
}

const filePath = 'data/fng.1000.csv.rot128';
if (fs.existsSync(filePath)) {
    processDonations(filePath);
} else {
    console.log(`Error: The file at '${filePath}' does not exist.`);
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
