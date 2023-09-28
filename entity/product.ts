import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm"

@Entity()
 export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column()
    quantity: number;

    @Column()
    imgSrc: string;

    @Column({
        default: 0
    })
    numberOfSales: number;
}