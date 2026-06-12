# 🏥 Clinic Appointment API

A RESTful API built with **NestJS** for managing clinic operations, including patient appointments, doctor schedules, and medical records, featuring role-based authentication, complex relational database modeling, and end-to-end testing.

[Postman Documentation]()
---

## Architecture Pattern - *Modular Layered Architecture*

Project ini menggunakan **Modular Layered Architecture** dengan alur utama:

```bash
Client → Controller → Service → Database (TypeORM + PostgreSQL)
```

### Struktur Tanggung Jawab (Separation of Concerns)

| Layer | Tanggung Jawab |
|------|----------------|
| **Controller** | Menerima HTTP request, validasi awal, dan mengembalikan response |
| **Service** | Berisi logika bisnis utama aplikasi |
| **Entity (TypeORM)** | Merepresentasikan tabel database |
| **Module** | Mengikat controller, service, dan provider dalam satu fitur |

Setiap fitur dikelola sebagai **modul terpisah** (`auth`, `patients`, `doctors`, `appointments`, `database`) sehingga aplikasi lebih terstruktur dan mudah dikembangkan.

## Alasan Memilih *Modular Layered Architecture*

1. **Scalable (Mudah Dikembangkan)**  
   - Fitur baru bisa ditambahkan tanpa merusak fitur lama.  
   - Setiap domain berdiri sebagai modul independen.

2. **Maintainable (Mudah Dipelihara)**  
   - Kode terorganisir berdasarkan fitur, bukan tipe file.  
   - Mudah ditemukan dan diperbaiki saat terjadi bug.

3. **Testable (Mudah Dites)**  
   - Service bisa diuji secara unit test.  
   - Controller bisa diuji dengan E2E test.

4. **Best Practice NestJS**  
   - Mengikuti rekomendasi resmi NestJS.  
   - Cocok untuk aplikasi backend profesional.

5. **Team Friendly**  
   - Developer bisa bekerja paralel pada modul berbeda.  
   - Mengurangi konflik saat merge code.


## Features

### Authentication & Authorization
- JWT-based authentication
- Role Guard system (Admin, Doctor, Patient)
- Secure login & registration system
- Strategy menggunakan jwt.strategy.ts

### Database (PostgreSQL + TypeORM)
Mengelola 6 tabel inti dengan relasi yang saling terhubung:
- Patients (Data pasien)
- Doctors (Data dokter spesialis)
- Schedules (Jadwal praktek, One-to-Many dari Doctors)
- Appointments (Janji temu, Many-to-One ke Patients dan Schedules)
- Medical_Records (Riwayat rekam medis, terikat pada Patients dan Doctors)
- Prescriptions (Resep obat, dikeluarkan oleh Doctors dan terikat pada Medical_Records)

### Clinic Management (CRUD)
Sistem ini memiliki concern yang berbeda berdasarkan role:
- Doctors: Bisa mengatur `Schedules` (Jadwal Praktek), melihat daftar `Appointments`, serta membuat `Medical_Records` dan `Prescriptions` pasca pemeriksaan.
- Patients: Bisa melihat jadwal dokter yang tersedia, melakukan booking `Appointments`, dan melihat riwayat `Medical_Records` serta `Prescriptions` mereka.

### Testing
- End-to-End testing dengan Jest  
- Folder `test/` berisi:
  - `app.e2e-spec.ts`
  - `auth.e2e-spec.ts`


## Run Project

Pastikan PostgreSQL sudah berjalan, lalu:

```bash
npm install
npm run start:dev
```

Aplikasi akan berjalan di:

```bash
http://localhost:3000
```

