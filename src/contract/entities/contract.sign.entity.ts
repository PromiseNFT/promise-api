import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';

@Entity()
export class ContractSign extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({
    type: 'varchar',
  })
  account_priv_key: string;
  
  @Column({
    type: 'varchar',
  })
  account_addr: string;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  sign_dttm: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  user_addr: string;

  @ManyToOne((type) => Contract, (contract) => contract.signs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  contract: Contract;
}
