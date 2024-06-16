import {IProductRepository} from "../../interfaces/facilityInterfaces";
import {DataSource} from "../Database";
import {ProductEntity} from "../../core/entities/facilityEntities/ProductEntity";

export class ProductRepository implements IProductRepository {
  constructor(
    private readonly dataSource: DataSource,
  ) {
  }

  async save(product: ProductEntity): Promise<ProductEntity> {
    const facilityExists = this.dataSource.facilities.getById(product.owner?.id as number);

    if (!facilityExists) {
      throw new Error("Product facility does not exist");
    }

    const tagsExist = product.tags?.every((tag) => {
      return this.dataSource.tags.getById(tag.id as number);
    });

    if (!tagsExist) {
      throw new Error("Not all product tags exist");
    }

    return this.dataSource.products.save(product);
  }

  fetchById(id: number): Promise<ProductEntity | undefined> {
    return this.dataSource.products.getById(id);
  }
}
