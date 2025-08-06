import { CreateDateColumn, UpdateDateColumn, Column } from 'typeorm';

export abstract class BaseTimeEntity {
  @CreateDateColumn()
  @Column({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn()
  @Column({ name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
