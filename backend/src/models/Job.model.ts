// backend/src/models/Job.model.ts

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import User from './User.model';

export enum JobStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEWING = 'interviewing',
  OFFER = 'offer',
  REJECTED = 'rejected'
}

@Table({
  tableName: 'jobs',
  timestamps: true
})
export default class Job extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.STRING)
  company!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column(DataType.STRING)
  location?: string;

  @Column(DataType.STRING)
  url?: string;

  @Column(DataType.STRING)
  salary?: string;

  @Column({
    type: DataType.ENUM(...Object.values(JobStatus)),
    defaultValue: JobStatus.SAVED
  })
  status!: JobStatus;

  @Column({
    type: DataType.DATE,
    allowNull: true
  })
  appliedDate?: Date;

  @Column(DataType.TEXT)
  notes?: string;

  @ForeignKey(() => User)
  @Column(DataType.INTEGER)
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}