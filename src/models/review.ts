import { Entity, Column, ManyToOne, JoinColumn,BeforeInsert } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { Product } from "./product";
import { User } from "./user";
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { Max, Min } from "class-validator"

@Entity()
export class Review extends BaseEntity {
  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "int" })
  @Min(1)
  @Max(5)
  rating: number;

  @Column()
  product_id: string

  
  @Column()
  user_id: string
  
  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: "product_id" })
  product: Product;
}