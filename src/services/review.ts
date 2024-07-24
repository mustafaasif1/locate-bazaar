
import { Lifetime } from 'awilix';
import { 
  TransactionBaseService, 
  FindConfig,
  Selector,
  MedusaContainer,
} from "@medusajs/medusa";
import { MedusaError } from "@medusajs/utils";

import { Review } from "../models/review";
import { ReviewRepository } from "../repositories/review";
import { User} from "@medusajs/medusa";

type CreateReviewInput = {
  title: string;
  description?: string;
  rating: number;
  product_id?: string;
  user_id?: string;
};

type UpdateReviewInput = Partial<CreateReviewInput>;

class ReviewService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.SCOPED;

  protected readonly reviewRepository_: typeof ReviewRepository;
  protected readonly loggedInUser_: User | null;

  constructor(container:MedusaContainer) {
    super(container);
    
    // try {
    //   this.loggedInUser_ = container.loggedInUser;
    // } catch (e) {
    //   // avoid errors when backend first runs
    // }
  }

  async create(reviewObject: CreateReviewInput): Promise<Review> {
    return await this.atomicPhase_(async (transactionManager) => {
      const reviewRepo = transactionManager.getRepository(Review)
      const review = reviewRepo.create(reviewObject);
      return await reviewRepo.save(review);
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