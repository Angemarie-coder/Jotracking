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
  timestamps: true,
  underscored: false,  // Use camelCase for column names
  freezeTableName: true  // Prevent Sequelize from pluralizing the table name
})
export default class Job extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    field: 'jobTitle'  // Explicitly set the column name to match the database
  })
  title!: string;

  @Column(DataType.STRING)
  company!: string;

  @Column(DataType.TEXT)
  description?: string;

  @Column({
    type: DataType.STRING,
    field: 'jobLocation'  // Explicitly set the column name to match the database
  })
  location?: string;

  @Column(DataType.STRING)
  url?: string;

  @Column(DataType.STRING)
  salary?: string;

  @Column({
    type: DataType.ENUM(...Object.values(JobStatus)),
    field: 'status',
    defaultValue: JobStatus.SAVED
  })
  status!: JobStatus;

  @Column({
    type: DataType.DATE,
    field: 'appliedDate',
    allowNull: true
  })
  appliedDate?: Date;

  @Column(DataType.TEXT)
  notes?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    field: 'userId'
  })
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @Column({
    type: DataType.DATE,
    field: 'createdAt'
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    field: 'updatedAt'
  })
  updatedAt!: Date;
}