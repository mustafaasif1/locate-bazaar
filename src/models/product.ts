import { JoinTable, Entity, JoinColumn, ManyToMany, ManyToOne, Index, Column ,OneToMany} from 'typeorm';
import { Store } from './store';
import { Product as MedusaProduct } from '@medusajs/medusa';
import { ShippingOption } from './shipping-option';
import { Review } from "./review";


@Entity()
export class Product extends MedusaProduct {
	@Index('ProductStoreId')
	@Column({ nullable: true })
	store_id: string | null;

	@ManyToOne(() => Store, (store) => store.products)
	@JoinColumn({ name: 'store_id', referencedColumnName: 'id' })
	store: Store | null;

	@ManyToMany(() => ShippingOption, { cascade: true })
	@JoinTable({
		name: 'product_shipping_options',
		joinColumn: {
			name: 'product_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'shipping_option_id',
			referencedColumnName: 'id',
		},
	})
	shipping_options: ShippingOption[];
	
	@Column({ type: "decimal", precision: 3, scale: 2, nullable: true })
	average_rating: number;
  
	@OneToMany(() => Review, review => review.product)
	reviews: Review[];
}
