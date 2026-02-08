# IoT WhatsApp Bot (Next.js + Neon + Fonnte)

Aplikasi bot WhatsApp pintar untuk monitoring dan kontrol perangkat IoT (Pompa Air & Sensor Ketinggian Air/PH) secara real-time. Dibangun menggunakan Next.js, database Neon (PostgreSQL), dan integrasi API WhatsApp Fonnte.

## 🌟 Fitur Utama

1.  **Monitoring Data Real-time**
    *   Melihat logs sensor terbaru (PH, Battery, Water Level).
    *   Format data rapi dan mudah dibaca via WhatsApp.
    
2.  **Kontrol Jarak Jauh (Remote Control)**
    *   **Nyalakan Pompa**: Kirim perintah `ON` untuk menyalakan pompa.
    *   **Matikan Pompa**: Kirim perintah `OFF` untuk mematikan pompa.
    *   **Cek Status**: Mengetahui apakah pompa sedang menyala atau mati beserta waktu update terakhir.

3.  **Auto-Reply Cerdas**
    *   **Menu Navigasi**: Ketik `MENU` atau `CEK` untuk melihat pilihan.
    *   **Sapaan**: Menjawab `hai`, `halo`, dll.
    *   **Fallback**: Memberi panduan jika user mengirim perintah yang tidak dikenali.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
*   **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
*   **WhatsApp API**: [Fonnte](https://fonnte.com/)
*   **Deployment**: [Vercel](https://vercel.com/)
*   **Language**: TypeScript

## 🚀 Cara Penggunaan (User WhatsApp)

Pastikan nomor Anda sudah terdaftar atau bot sudah aktif.
Berikut adalah perintah dasar yang bisa dikirim ke nomor bot:

| Perintah | Fungsi |
| :--- | :--- |
| `MENU` / `CEK` | Menampilkan menu utama. |
| `1` | Melihat **Monitoring Logs** (Status Air, Baterai). |
| `2` | Melihat **Status Pompa** (On/Off). |
| `ON` | Menyalakan Pompa. |
| `OFF` | Mematikan Pompa. |

## ⚙️ Instalasi & Setup Lokal

1.  **Clone Repository**
    ```bash
    git clone https://github.com/KKN-MARGOLESTARI-T31/IOT-WHATSAPP.git
    cd IOT-WHATSAPP
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (`.env`)**
    Buat file `.env` dan isi dengan kredensial Anda:
    ```env
    # Database Neon
    DATABASE_URL="postgresql://user:pass@endpoint.neon.tech/neondb?sslmode=require"
    SOURCE_DATABASE_URL="postgresql://user:pass@endpoint-source.neon.tech/neondb?sslmode=require"

    # Fonnte API (Untuk kirim WA)
    FONNTE_TOKEN="TOKEN_FONNTE_ANDA"

    # App Config
    NEXT_PUBLIC_APP_URL="http://localhost:3000"
    ```

4.  **Jalankan Server Development**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

5.  **Expose ke Internet (Untuk Webhook)**
    Gunakan Ngrok agar Fonnte bisa mengirim pesan ke localhost Anda:
    ```bash
    ngrok http 3000
    ```
    Copy URL Ngrok ke Dashboard Fonnte (Menu Webhooks).

## 🌐 Deployment (Vercel)

1.  Push kode ke GitHub.
2.  Import project di Dashboard Vercel.
3.  **PENTING**: Masukkan semua variabel `.env` ke **Environment Variables** di Vercel.
    *   `DATABASE_URL`
    *   `FONNTE_TOKEN` (Jangan sampai salah/typo!)
    *   `NEXT_PUBLIC_APP_URL` (Isi dengan domain Vercel Anda, misal: `https://project.vercel.app`)
4.  Deploy!
5.  **Update Webhook Fonnte**:
    Masuk ke Dashboard Fonnte dan arahkan webhook ke:
    `https://project-name.vercel.app/api/webhook-fonnte`

## 📂 Struktur Database

*   `monitoring_logs`: Menyimpan data sensor IoT.
*   `device_controls`: Menyimpan status perintah pompa (ON/OFF).
*   `auto_reply_rules` (Optional): Menyimpan keyword balasan otomatis statis.
*   `audit_logs`: Mencatat history pesan masuk dan keluar.
*   `message_queue`: Antrian pesan WhatsApp.

---
**Troubleshooting:**
Jika bot tidak membalas di Vercel:
1. Cek `FONNTE_TOKEN` di Environment Variables Vercel.
2. Cek URL Webhook di Fonnte (harus `https` dan benar).
3. Cek apakah database `monitoring_logs` terisi data.
