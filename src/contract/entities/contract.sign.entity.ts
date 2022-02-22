import { BaseEntity, Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';

@Entity()
export class ContractSign extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @PrimaryColumn()
  account_addr: string;

  @Column({
    type: 'varchar',
  })
  account_pub_key: string;

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

  @ManyToOne((type) => Contract, (contract) => contract.signs)
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  contract: Contract;
}
