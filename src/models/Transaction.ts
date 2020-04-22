import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import ColumnNumericTransformer from '../helpers/ColumnNumericTransformer';
import Category from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column('decimal', { scale: 2, transformer: new ColumnNumericTransformer() })
  value: number;

  @CreateDateColumn({ select: false })
  @Column()
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @CreateDateColumn({ select: false })
  updated_at: Date;
}

export default Transaction;
