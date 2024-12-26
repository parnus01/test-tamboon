# TAMBOON TEST --JS--

## Requirements

- Node.js (v14 or higher)
- Yarn / NPM (for package management)
- Omise API keys

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/parnus01/test-tamboon.git
   cd tamboon-dot-js
   ```

2. Install dependencies using Yarn:
    ```
    yarn
    ```

3. Create a .env file in the root directory of the project and add your Omise API keys:
    ```
    OMISE_PUBLIC_KEY=your_public_key_here
    OMISE_SECRET_KEY=your_secret_key_here
    ```

    Replace your_public_key_here and your_secret_key_here with the actual API keys from Omise.
    Note: You can get your API keys from the Omise Dashboard.

4. Execute charge script
    ```
   node charge_script.js
    ```
