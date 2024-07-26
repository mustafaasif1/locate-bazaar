import { Lifetime } from 'awilix';
import {  ProductService as MedusaProductService, Product, User } from '@medusajs/medusa';
import { MedusaError } from '@medusajs/utils';
import {
	CreateProductInput as MedusaCreateProductInput,
	FindProductConfig,
	ProductSelector as MedusaProductSelector,
	UpdateProductInput as MedusaUpdateProductInput,
} from '@medusajs/medusa/dist/types/product';
import StoreService from './store';
import ShippingOptionRepository from '../repositories/shipping-option';
import { Review } from 'src/models/review';
import { EntityManager } from 'typeorm';


type ProductSelector = {
	store_id?: string;
} & MedusaProductSelector;

type CreateProductInput = {
	store_id?: string;
	shipping_options?: string[];
} & MedusaCreateProductInput;

type UpdateProductInput = {
	shipping_options?: string[];
} & MedusaUpdateProductInput;

class ProductService extends MedusaProductService {
	static LIFE_TIME = Lifetime.SCOPED;
	protected readonly loggedInUser_: User | null;
	protected readonly storeService_: StoreService;
	protected readonly shippingOptionRepository_: typeof ShippingOptionRepository;

	constructor(container) {
		super(container);

		this.storeService_ = container.storeService;
		this.shippingOptionRepository_ = container.shippingOptionRepository;
		
		try {
			this.loggedInUser_ = container.loggedInUser;
		} catch (e) {
			// avoid errors when backend first runs
		}
	}

	private prepareListConfig_(selector: ProductSelector) {
		if (!selector.store_id && this.loggedInUser_?.store_id) {
			selector.store_id = this.loggedInUser_.store_id;
		}
	}

	async list(selector: ProductSelector, config: FindProductConfig = {}): Promise<Product[]> {
		this.prepareListConfig_(selector);

		return await super.list(selector, config);
	}

	async listAndCount(selector: ProductSelector, config: FindProductConfig = {}): Promise<[Product[], number]> {
		this.prepareListConfig_(selector);

		return await super.listAndCount(selector, config);
	}

	async retrieve(productId: string, config: FindProductConfig = {}): Promise<Product> {
		const product = await super.retrieve(productId, config);

		if (product.store_id && this.loggedInUser_?.store_id && product.store_id !== this.loggedInUser_.store_id) {
			// Throw error if you don't want a product to be accessible to other stores
			throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Product does not exist');
		}

		return product;
	}

	async create(productObject: CreateProductInput): Promise<Product> {
		if (this.loggedInUser_) {
			productObject.store_id = this.loggedInUser_.store_id;
		}

		// Upsert shipping options if they exist
		if (productObject.shipping_options?.length) {
			productObject.shipping_options = await this.shippingOptionRepository_.upsertShippingOptions(
				productObject.shipping_options
			);
		}

		return await super.create(productObject);
	}

	async update(productId: string, update: UpdateProductInput): Promise<Product> {
		if (update.shipping_options) {
			update.shipping_options = await this.shippingOptionRepository_.upsertShippingOptions(
				update.shipping_options
			);
		}

		return await super.update(productId, update);
	}
     

	async updateAverageRating(productId: string): Promise<void> {
        const manager: EntityManager = this.manager_;
        const productRepo = manager.getRepository(Product);
        const reviewRepo = manager.getRepository(Review);

        const product = await productRepo.findOne({ where: { id: productId } });
        if (!product) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Product not found');
        }

        const reviews = await reviewRepo.find({ where: { product_id: productId } });

        if (reviews.length > 0) {
            const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
            product.average_rating = parseFloat((sum / reviews.length).toFixed(1));
        } else {
            product.average_rating = 0;
        }

        await productRepo.save(product);
		//this implementation might need to be updated in the future
    }
}

export default ProductService;
