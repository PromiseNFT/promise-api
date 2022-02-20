import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class ContractSign {
    @PrimaryColumn()
    id: number;

    @Column({
        type: "varchar",
    })
    account_addr: string;

    @Column({
        type: "varchar",
    })
    account_pub_key: string;

    @Column({
        type: "datetime",
        nullable: true,
    })
    sign_dttm: Date;

    @Column({
        type: "varchar",
        nullable: true,
    })
    user_addr: string;
}
