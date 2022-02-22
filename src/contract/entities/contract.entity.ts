import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { ContractSign } from './contract.sign.entity';
import { ContractTx } from './contract.tx.entity';

@Entity()
export class Contract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  user_addr: string;

  @Column({
    type: 'datetime',
  })
  crt_dttm: Date;

  @Column({
    type: 'varchar',
  })
  account_addr: string;

  @Column({
    type: 'varchar',
  })
  account_pub_key: string;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'varchar',
  })
  ctnt: string;

  @Column({
    type: 'varchar',
  })
  location: string;

  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'varchar',
  })
  time: Date;


  @Column({
    type: 'bigint',
  })
  head_count: number;

  @OneToMany(() => ContractSign, sign => sign.contract)
  signs: ContractSign[];

  @OneToOne(() => ContractTx, tx => tx.contract, { nullable: true })
  tx: ContractTx;
}
