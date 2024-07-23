import { Review } from 'src/models/review';
import {  Repository } from 'typeorm';

export class ReviewRepository extends Repository<Review> {}

// async findByProductId(productId: string): Promise<Review[]> {
//     return this.find({ where: { product_id: productId } });
//   }