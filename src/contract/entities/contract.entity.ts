import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    type: 'datetime',
  })
  dttm: Date;

  @Column({
    type: 'bigint',
  })
  headcount: number;
}
