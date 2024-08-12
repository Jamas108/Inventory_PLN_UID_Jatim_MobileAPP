const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// Buat koneksi ke MySQL
const db = mysql.createConnection({
    host: 'localhost',       // atau IP server MySQL Anda
    user: 'root',            // ganti dengan username MySQL Anda
    password: '',    // ganti dengan password MySQL Anda
    database: 'inventory_pln_uid_jatim'  // ganti dengan nama database Anda
});

// Koneksi ke MySQL
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Endpoint to get a specific user by ID
app.get('/users', (req, res) => {
    let sql = `SELECT Nama, Jenis_Kelamin, No_Telepon, email FROM users`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});

// Endpoint to get a specific user by ID
app.get('/users_role', (req, res) => {
    let sql = `SELECT Nama_Role_Users, Deskripsi_Role_Users FROM users_role`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result[0]);
    });
});


//endpoint Barang Masuk 
app.get('/barang_masuk', (req, res) => {
    let sql = 'SELECT Nama_Barang, Kode_Barang, Jenis_Barang FROM barang_masuk';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});



// Endpoint to save Barang Keluar
app.post('/barang_keluar', (req, res) => {
    const { tanggal_BarangKeluar, Id_Kategori_Peminjaman, tanggal_PengembalianBarang, Id_User, Id_StatusBarangKeluar, barangItems } = req.body;
    
    const sql = 'INSERT INTO barang_keluar (tanggal_BarangKeluar, Id_Kategori_Peminjaman, tanggal_PengembalianBarang, Id_User, Id_StatusBarangKeluar, Nama_Barang, Kode_BarangKeluar, Kategori_Barang, Jumlah_Barang) VALUES ?';

    const values = barangItems.map(item => [
        tanggal_BarangKeluar, 
        Id_Kategori_Peminjaman, 
        tanggal_PengembalianBarang,
        Id_User,
        Id_StatusBarangKeluar,
        item.Nama_Barang,
        item.Kode_BarangKeluar,
        item.Kategori_Barang,
        item.Jumlah_Barang
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ success: false, message: 'Failed to save data', error: err });
        } else {
            res.json({ success: true, message: 'Barang keluar successfully saved!' });
        }
    });
});


// Jalankan server
app.listen('3000', () => {
    console.log('Server started on port 3000');
});
