import { User, UserStatus } from '../models/user';
import { Store } from '../models/store';
import { Product } from '../models/product';
import { ShippingOption } from '../models/shipping-option';

declare module '@medusajs/medusa/dist/models/user' {
	interface User {
		store_id: string | null;
		store: Store | null;
		status: UserStatus;
		is_admin: boolean;
	}
}

declare module '@medusajs/medusa/dist/models/product' {
	interface Product {
		store_id: string;
		store: Store;
		shipping_options: ShippingOption[];
		average_rating:number,

	}
}

declare module '@medusajs/medusa/dist/models/order' {
	interface Order {
		store_id: string;
		store: Store;

		parent_id: string | null;
		parent: Order | null;

		children: Order[] | null;
	}
}
declare module '@medusajs/medusa/dist/models/order' {
	interface Review {
		title:string,
		description:string,
		rating:number,
	}
}
declare module '@medusajs/medusa/dist/models/shipping-option' {
	interface ShippingOption {
		store: Store;
		store_id: string;
		products: Product[];
	}
}

declare module '@medusajs/medusa/dist/api/routes/admin/products' {
	interface AdminPostProductsProductReq {
		shipping_options?: string[];
	}
}
