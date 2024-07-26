import { Entity, Column, ManyToOne, JoinColumn,BeforeInsert, PrimaryColumn } from "typeorm";
import { BaseEntity } from "@medusajs/medusa";
import { Product } from "./product";
import { User } from "./user";

import { Max, Min } from "class-validator"

@Entity()
export class Review extends BaseEntity {

  @PrimaryColumn()
  id: string;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  // @BeforeInsert()
  // private beforeInsert(): void {
  //   this.id = generateEntityId(this.id, "review")
  // }
}