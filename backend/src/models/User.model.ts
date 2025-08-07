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
  timestamps: true
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
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
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isAdmin!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationToken!: string | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  verificationTokenExpires!: Date | null;

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
    if (baseUrl.startsWith('jobtracker://')) {
      // Deep link format for mobile app (local development)
      return `${baseUrl}?token=${this.verificationToken}&email=${encodeURIComponent(this.email)}`;
    } else if (baseUrl.startsWith('https://') || baseUrl.startsWith('http://')) {
      // Web URL format (production or local web)
      return `${baseUrl}?token=${this.verificationToken}&email=${encodeURIComponent(this.email)}`;
    } else {
      // Fallback web URL format
      return `${baseUrl}/verify-email?token=${this.verificationToken}&email=${encodeURIComponent(this.email)}`;
    }
  }
}
