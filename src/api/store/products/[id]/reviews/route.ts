
import {
    MedusaRequest,
    MedusaResponse,
    validator,
  } from '@medusajs/medusa';
  import { EntityManager } from 'typeorm';
import ReviewService from 'src/services/review';
import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';
import cors from "cors"
import bodyParser from 'body-parser';

// import {projectConfig} from "./../../../../../../medusa-config";
// const storeCorsOptions = {
//   origin: projectConfig.store_cors.split(","),
//   credentials: true,
// }  


class CreateReviewInput {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsUUID()
  product_id: string;

  @IsUUID()
  user_id: string;
}

  export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const validated = await validator(CreateReviewInput, req.body);
  
    const reviewService: ReviewService = req.scope.resolve("reviewService");
  
    try {
      const result = await reviewService.create(validated);
      res.status(201).json({ review: result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const reviewService: ReviewService = req.scope.resolve("reviewService");
    const productId = req.params.id; 
    try {
      const reviews = await reviewService.findByProductId(productId);
      res.status(200).json({ reviews });
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred", error: error.message });
    }
  };

  export const LIST = async (req: MedusaRequest, res: MedusaResponse) => {
    const reviewService: ReviewService = req.scope.resolve('reviewService');
    const productId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

   try {
    const [reviews, count] = await reviewService.listAndCount(productId);
    const totalPages = Math.ceil(count / Number(limit));
    const paginatedReviews = reviews.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    res.status(200).json({
      reviews: paginatedReviews,
      count,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: "An unexpected error occurred", error: error.message });
  }
};

  export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const manager: EntityManager = req.scope.resolve('manager');
  const reviewService: ReviewService = req.scope.resolve('reviewService');

  await manager.transaction(async (transactionManager) => {
    await reviewService.withTransaction(transactionManager).delete(req.params.id);
  });

  res.status(204).send();
};

//   type UpdateReviewInput = Partial<CreateReviewInput>;

// export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
//   const validated = await validator(UpdateReviewInput, req.body);

//   const manager: EntityManager = req.scope.resolve('manager');
//   const reviewService: ReviewService = req.scope.resolve('reviewService');

//   const result = await manager.transaction(async (transactionManager) => {
//     return await reviewService.withTransaction(transactionManager).update(req.params.id, validated);
//   });

//   res.status(200).json({ review: result });
// };

//   type CreateReviewInput = {
//     title: string;
//     description?: string;
//     rating: number;
//     product_id: string;
//     user_id: string;
//   };
   // export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const reviewService: ReviewService = req.scope.resolve('reviewService');
  
  //   const review = await reviewService.retrieve(req.params.id);
  
  //   res.status(200).json({ review });
  // };


// export const LIST = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const reviewService: ReviewService = req.scope.resolve('reviewService');
  //   const selector = req.query;
  
  //   const reviews = await reviewService.list(selector);
  
  //   res.status(200).json({ reviews });
  // };


// export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  //   const validated = await validator(CreateReviewInput, req.body);
  
  //   const manager: EntityManager = req.scope.resolve('manager');
  //   const reviewService: ReviewService = req.scope.resolve('reviewService');
  
  //   const result = await manager.transaction(async (transactionManager) => {
  //     return await reviewService.withTransaction(transactionManager).create(validated);
  //   });
  
  //   res.status(201).json({ review: result });
  // };