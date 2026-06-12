import { MigrationInterface, QueryRunner } from "typeorm";

export class InitClinicSchema1700000000000 implements MigrationInterface {
    name = 'InitClinicSchema1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('ADMIN', 'DOCTOR', 'PATIENT')`);
        await queryRunner.query(`CREATE TYPE "appointment_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED')`);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL UNIQUE,
                "password" character varying NOT NULL,
                "role" "user_role_enum" NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "doctors" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL UNIQUE,
                "name" character varying NOT NULL,
                "specialization" character varying NOT NULL,
                "phone" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_doctors" PRIMARY KEY ("id"),
                CONSTRAINT "FK_doctors_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "patients" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL UNIQUE,
                "name" character varying NOT NULL,
                "date_of_birth" DATE NOT NULL,
                "phone" character varying,
                "address" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_patients" PRIMARY KEY ("id"),
                CONSTRAINT "FK_patients_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "schedules" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "doctor_id" uuid NOT NULL,
                "day_of_week" int NOT NULL, -- 0 (Minggu) sampai 6 (Sabtu)
                "start_time" time NOT NULL,
                "end_time" time NOT NULL,
                "is_active" boolean NOT NULL DEFAULT true,
                CONSTRAINT "PK_schedules" PRIMARY KEY ("id"),
                CONSTRAINT "FK_schedules_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "appointments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "patient_id" uuid NOT NULL,
                "schedule_id" uuid NOT NULL,
                "appointment_date" DATE NOT NULL,
                "status" "appointment_status_enum" NOT NULL DEFAULT 'PENDING',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_appointments" PRIMARY KEY ("id"),
                CONSTRAINT "FK_appointments_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_appointments_schedule" FOREIGN KEY ("schedule_id") REFERENCES "schedules"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "medical_records" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "patient_id" uuid NOT NULL,
                "doctor_id" uuid NOT NULL,
                "appointment_id" uuid, -- Opsional: Referensi ke janji temu spesifik
                "diagnosis" text NOT NULL,
                "notes" text,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_medical_records" PRIMARY KEY ("id"),
                CONSTRAINT "FK_medical_records_patient" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_medical_records_doctor" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_medical_records_appointment" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE SET NULL
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "prescriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "medical_record_id" uuid NOT NULL,
                "medication_name" character varying NOT NULL,
                "dosage" character varying NOT NULL,
                "instructions" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_prescriptions" PRIMARY KEY ("id"),
                CONSTRAINT "FK_prescriptions_medical_record" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "prescriptions"`);
        await queryRunner.query(`DROP TABLE "medical_records"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TABLE "schedules"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "appointment_status_enum"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }
}