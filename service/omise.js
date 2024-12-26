import Omise from 'omise';
import dotenv from 'dotenv';

dotenv.config();

class OmiseService {
    constructor() {
        this.omise = new Omise({
            publicKey: process.env.OMISE_PUBLIC_KEY,
            secretKey: process.env.OMISE_SECRET_KEY
        });
    }

    // Method to create a token using card data
    async createToken(cardData) {
        try {
            const token = await this.omise.tokens.create({ card: cardData });
            return token.id;
        } catch (error) {
            console.error("Error creating token:", error);
            throw error; 
        }
    }

    // Method to create a charge using the token id
    async createCharge(tokenId, amount) {
        try {
            const charge = await this.omise.charges.create({
                amount,
                currency: 'thb',
                card: tokenId
            });
            return charge;
        } catch (error) {
            console.error("Error creating charge:", error);
            throw error; 
        }
    }
}

export default OmiseService