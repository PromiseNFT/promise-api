import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { ContractSign } from './contract.sign.entity';
import { ContractTx } from './contract.tx.entity';

@Entity()
export class Contract extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  user_addr: string;

  @Column({
    type: 'datetime',
    default: () => "CURRENT_TIMESTAMP"
  })
  crt_dttm: Date;

  @Column({
    type: 'varchar',
  })
  account_priv_key: string;

  @Column({
    type: 'varchar',
  })
  account_addr: string;

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

  @OneToMany((type) => ContractSign, (sign) => sign.contract)
  signs: ContractSign[];

  @OneToOne((type) => ContractTx, (tx) => tx.contract, { nullable: true })
  tx: ContractTx;
}
