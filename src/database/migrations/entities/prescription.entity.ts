import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'medication_name', type: 'varchar' })
  medicationName: string;

  @Column({ type: 'varchar' })
  dosage: string;

  @Column({ type: 'text' })
  instructions: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => MedicalRecord, (medicalRecord) => medicalRecord.prescriptions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medical_record_id' })
  medicalRecord: MedicalRecord;
}