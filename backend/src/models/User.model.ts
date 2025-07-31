// backend/src/models/User.model.ts
import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import Job from './Job.model';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,  // Use camelCase for column names
  freezeTableName: true  // Prevent Sequelize from pluralizing the table name
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'firstName'  // Explicitly set the column name to match the database
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'lastName'  // Explicitly set the column name to match the database
  })
  lastName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.BOOLEAN,
    field: 'isVerified',
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: 'isAdmin',
    defaultValue: false,
  })
  isAdmin!: boolean;

  @Column({
    type: DataType.STRING,
    field: 'verificationToken',
    allowNull: true,
  })
  verificationToken!: string | null;

  @Column({
    type: DataType.DATE,
    field: 'verificationTokenExpires',
    allowNull: true,
  })
  verificationTokenExpires!: Date | null;

  @Column({
    type: DataType.DATE,
    field: 'createdAt',
  })
  createdAt!: Date;

  @Column({
    type: DataType.DATE,
    field: 'updatedAt',
  })
  updatedAt!: Date;

  // Associations
  @HasMany(() => Job)
  jobs!: Job[];

  // Hooks
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      instance.password = await bcrypt.hash(instance.password, salt);
    }
  }

  @BeforeCreate
  static generateVerificationToken(instance: User) {
    const token = crypto.randomBytes(32).toString('hex');
    instance.verificationToken = token;
    instance.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }

  // Instance methods
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  generateVerificationUrl(baseUrl: string): string {
    return `${baseUrl}/verify-email?token=${this.verificationToken}&email=${encodeURIComponent(this.email)}`;
  }
}
