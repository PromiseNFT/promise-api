import { BaseEntity, Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Contract } from './contract.entity';

@Entity()
export class ContractTx extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({
    type: 'datetime',
  })
  tx_dttm: Date;

  @Column({
    type: 'varchar',
  })
  tx_hash: string;

  @Column({
    type: 'varchar',
  })
  tx_id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  image_path: string;

  @Column({
    type: 'varchar',
  })
  token_id: string;

  @Column({
    type: 'varchar',
  })
  meta_data: string;

  @OneToOne((tpye) => Contract, (contract) => contract.tx)
  @JoinColumn({ name: "id", referencedColumnName: "id" })
  contract: Contract;
}
