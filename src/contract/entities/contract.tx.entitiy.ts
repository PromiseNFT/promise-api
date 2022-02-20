import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ContractTx {
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
  meta_data: string;
}
