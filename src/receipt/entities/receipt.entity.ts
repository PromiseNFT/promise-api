import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity()
export class ReceiptEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "int",
    })
    sellerID:  number;

    @Column({
        type: "int",
    })
    productID:  number;

    @Column({
        type: "bigint",
    })
    tokenID:  number;

    @Column({
        type: "varchar",
    })
    tokenURI: string;

    @Column({
        type: "varchar",
    })
    contractAddr: string;

    @Column({
        type: "varchar",
    })
    fromAddr: string;

    @Column({
        type: "varchar",
    })
    toAddr: string;

    @Column({
        type: "datetime",
    })
    registeredDate: string;

    @Column({
        type: "datetime",
    })
    lastUpdatedDate: Date;

    @Column({
        type: "int",
    })
    isDeleted: number;

}
