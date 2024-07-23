
import {
    MedusaRequest,
    MedusaResponse,
    validator,
  } from '@medusajs/medusa';
  import { EntityManager } from 'typeorm';
import ReviewService from 'src/services/review';
  
  
import { IsString, IsOptional, IsInt, Min, Max, IsUUID } from 'class-validator';

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
  
    const manager: EntityManager = req.scope.resolve('manager');
    const reviewService: ReviewService = req.scope.resolve('reviewService');
  
    const result = await manager.transaction(async (transactionManager) => {
      return await reviewService.withTransaction(transactionManager).create(validated);
    });
  
    res.status(201).json({ review: result });
  };
  
  export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const reviewService: ReviewService = req.scope.resolve('reviewService');
  
    const review = await reviewService.retrieve(req.params.id);
  
    res.status(200).json({ review });
  };

  export const LIST = async (req: MedusaRequest, res: MedusaResponse) => {
    const reviewService: ReviewService = req.scope.resolve('reviewService');
    const selector = req.query;
  
    const reviews = await reviewService.list(selector);
  
    res.status(200).json({ reviews });
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
  