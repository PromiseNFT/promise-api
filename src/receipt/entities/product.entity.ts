import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "varchar",
    })
    name: string;

    @Column({
        type: "varchar",
    })
    image: string;

    @Column({
        nullable: true,
        type: "varchar",
    })
    contractAddr: string

    @Column({
        type: "datetime",
    })
    registeredDate: Date

    @Column({
        type: "int",
        default: false,
    })
    isDeleted: boolean;

    @Column({
        type: "varchar"
    })
    symbol: string;
}
