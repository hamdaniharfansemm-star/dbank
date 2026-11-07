/* =====================================================================
   DBank — Pengaturan koneksi server
   ---------------------------------------------------------------------
   MODE MULTI-CABANG (disarankan): isi supabaseUrl & supabaseKey dari
   Supabase › Project Settings › API (Project URL & anon public key).
   Langkah lengkap: PANDUAN.md bagian 2.

   apiUrl hanya untuk mode lama satu cabang (Google Apps Script).
   Semua kosong = mode sementara memakai server lama.
   ===================================================================== */
window.DBANK_CONFIG = {
  supabaseUrl: "",   // contoh: "https://abcdefgh.supabase.co"
  supabaseKey: "",   // anon public key (aman ditaruh di sini; data dijaga oleh fungsi server)
  apiUrl: ""
};
