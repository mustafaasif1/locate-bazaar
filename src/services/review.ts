// import { 
//     TransactionBaseService, 
//     FindConfig,
//     Selector,
//   } from "@medusajs/medusa"

//   import { EntityManager,FindManyOptions, FindOptionsWhere} from "typeorm"
//   import { Review } from "../models/review"
//   import { Product } from "../models/product"
// import ProductRepository from "@medusajs/medusa/dist/repositories/product"
// import { ReviewRepository } from "src/repositories/review"
  
//   class ReviewService extends TransactionBaseService {
//     protected readonly reviewRepository_: typeof ReviewRepository
//     protected readonly productRepository_: typeof ProductRepository
  
//     constructor(container) {
//       super(container)
//       this.reviewRepository_ = container.reviewRepository
//       this.productRepository_ = container.productRepository
//     }
  
//     async create(data: Partial<Review>) {
//       return await this.atomicPhase_(async (manager: EntityManager) => {
//         const reviewRepo = manager.getRepository(Review)
//         const productRepo = manager.getRepository(Product)
  
//         const review = reviewRepo.create(data)
//         const result = await reviewRepo.save(review)
  
//         const product = await productRepo.findOne({ where: { id: data.product_id } })
//         if (product) {
//           const reviews = await reviewRepo.find({ where: { product_id: data.product_id } })
//           const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          
//           await productRepo.update(data.product_id as string, { average_rating: avgRating })
//         }
  
//         return result
//       })
//     }
  
//     async retrieve(reviewId: string, config?: FindConfig<Review>) {
//         const reviewRepo = this.manager_.getRepository(Review)
//         const review = await reviewRepo.findOne({ where: { id: reviewId }, ...config })

//       if (!review) {
//         throw new Error(`Review with id: ${reviewId} not found`)
//       }
//       return review
//     }
  
//     // async list(selector: Selector<Review>, config?: FindConfig<Review>) {
//     //     const reviewRepo = this.manager_.getRepository(Review)
//     //     return await reviewRepo.find({ where: selector, ...config })
//     //   }
    
// //     async list(
// //         selector: Selector<Review>,
// //         config?: FindConfig<Review>
// //       ): Promise<Review[]> {
// //         const reviewRepo = this.manager_.getRepository(Review)
    
// //         const query: FindManyOptions<Review> = {
// //           where: {} as FindOptionsWhere<Review>,
// //           ...config
// //         }
    
// //         if ('product_id' in selector) {
// //           query.where = { ...query.where, product_id: selector.product_id }
// //         }
    
// //         if ('rating' in selector) {
// //           query.where = { ...query.where, rating: selector.rating }
// //         }
    
// //         // Add other fields as needed
    
// //         return await reviewRepo.find(query)
// //   }
// }
//   export default ReviewService


import { Lifetime } from 'awilix';
import { 
  TransactionBaseService, 
  FindConfig,
  Selector,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

import { Review } from "../models/review";
import { ReviewRepository } from "../repositories/review";
import { User} from "@medusajs/medusa";

type CreateReviewInput = {
  title: string;
  description?: string;
  rating: number;
  product_id: string;
  user_id: string;
};

type UpdateReviewInput = Partial<CreateReviewInput>;

class ReviewService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected readonly reviewRepository_: typeof ReviewRepository;
  protected readonly loggedInUser_: User | null;

  constructor(container) {
    super(container);
    this.reviewRepository_ = container.reviewRepository;

    // try {
    //   this.loggedInUser_ = container.loggedInUser;
    // } catch (e) {
    //   // avoid errors when backend first runs
    // }
  }

  async create(reviewObject: CreateReviewInput): Promise<Review> {
    return await this.atomicPhase_(async (manager) => {
        const reviewRepo = this.manager_.getRepository(Review)

      const review = reviewRepo.create(reviewObject);

      const result = await reviewRepo.save(review);

      return result;
    });
  }

  async retrieve(reviewId: string, config: FindConfig<Review> = {}): Promise<Review> {
    const reviewRepo = this.manager_.getRepository(Review)
    const review = await reviewRepo.findOne({ where: { id: reviewId }, ...config })

    if (!review) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Review not found");
    }

    return review;
  }

//   async list(productId: string): Promise<Review[]> {
//     const reviewRepo = this.manager_.getRepository(Review);
//     return await reviewRepo.find({
//       where: { product_id: productId },
//     });
//   }
async list(selector: Selector<Review>, config: FindConfig<Review> = {}): Promise<Review[]> {
    const reviewRepo = this.manager_.getRepository(Review);
    const query = {
      where: selector as any,
      ...config,
    };
    return await reviewRepo.find(query);
  }
  async listAndCount(productId: string): Promise<[Review[], number]> {
    const reviewRepo = this.manager_.getRepository(Review);
    return await reviewRepo.findAndCount({
      where: { product_id: productId },
    });
  }
  async update(reviewId: string, update: UpdateReviewInput): Promise<Review> {
    return await this.atomicPhase_(async (manager) => {
        const reviewRepo = this.manager_.getRepository(Review)
      const review = await this.retrieve(reviewId);

      const { ...rest } = update;

      for (const [key, value] of Object.entries(rest)) {
        if (typeof value !== "undefined") {
          review[key] = value;
        }
      }

      return await reviewRepo.save(review);
    });
  }

  async delete(reviewId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const reviewRepo = this.manager_.getRepository(Review)
      const review = await this.retrieve(reviewId);

      await reviewRepo.remove(review);
    });
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviewRepo = this.manager_.getRepository(Review)
    return await reviewRepo.find({
      where: { product_id: productId },
    });
  }
}

export default ReviewService;