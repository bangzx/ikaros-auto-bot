const axios = require("axios");
const { ethers } = require("ethers");
const { faker } = require("@faker-js/faker");
const readline = require("readline");

// Fungsi untuk input dari user
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk menampilkan banner
const showBanner = () => {
    console.log(`
     █████╗ ██╗   ██╗████████╗ ██████╗
    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗
    ███████║██║   ██║   ██║   ██║   ██║  
    ██╔══██║██║   ██║   ██║   ██║   ██║ 
    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝
    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝

    Telegram : https://t.me/airdropfetchofficial
    `);
};


// Fungsi untuk membuat wallet BSC secara random
const generateBSCWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    return wallet.address;
};

// Fungsi untuk membuat data pendaftaran random
const generateRandomData = (referralCode) => {
    return {
        name: faker.person.firstName() + " " + faker.person.lastName(),
        email: faker.internet.email(),
        wallet: generateBSCWallet(),
        telegram: faker.internet.username().replace(/\W/g, "_"), // Hanya huruf, angka, underscore
        referral: referralCode
    };
};

// Fungsi untuk mendaftarkan akun
const registerAccount = async (index, referralCode) => {
    const userData = generateRandomData(referralCode);
    
    const payload = new URLSearchParams();
    payload.append("action", "universal_airdrop_register");
    payload.append("security_token", "d7f40df084"); // Ganti jika token berubah
    payload.append("name", userData.name);
    payload.append("email", userData.email);
    payload.append("wallet", userData.wallet);
    payload.append("telegram", userData.telegram);
    payload.append("referral", userData.referral);

    try {
        const response = await axios.post("https://filakaros.com/wp-admin/admin-ajax.php", payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
                "Origin": "https://filakaros.com",
                "Referer": "https://filakaros.com/registration/",
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        // Cek respon dari server
        if (response.data.success) {
            console.log(`✅ [${index}] Berhasil: ${userData.email} - Referral: ${response.data.data.referral_link}`);
            return true;
        } else {
            console.log(`❌ [${index}] Gagal: ${userData.email} - ${response.data.data.message || "Unknown error"}`);
            return false;
        }
    } catch (error) {
        console.log(`❌ [${index}] Error: ${userData.email} - ${error.message}`);
        return false;
    }
};

// Menjalankan pendaftaran untuk setiap akun
const startRegistration = async (totalAccounts, referralCode) => {
    console.log(`🚀 Memulai pendaftaran ${totalAccounts} akun...\n`);

    let successCount = 0;
    let failedCount = 0;

    for (let i = 1; i <= totalAccounts; i++) {
        const success = await registerAccount(i, referralCode);
        if (success) {
            successCount++;
        } else {
            failedCount++;
        }

        // Tambahkan jeda acak 2-5 detik
        const delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    console.log("\n✅ Pendaftaran selesai!");
    console.log(`🔹 Total berhasil: ${successCount}`);
    console.log(`🔹 Total gagal: ${failedCount}`);
};

// Menjalankan input dari user
showBanner();
rl.question("Masukkan jumlah akun yang ingin didaftarkan: ", (total) => {
    if (isNaN(total) || total <= 0) {
        console.log("❌ Jumlah akun tidak valid!");
        rl.close();
        return;
    }

    rl.question("Masukkan kode referral Anda: ", (referralCode) => {
        if (!referralCode) {
            console.log("❌ Kode referral tidak boleh kosong!");
            rl.close();
            return;
        }

        rl.close();
        startRegistration(parseInt(total), referralCode);
    });
});
