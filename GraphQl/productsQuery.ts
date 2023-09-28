import {
    AppDataSource,
    productRepository
} from "../data-source";
import {Product} from "../entity/product";

export const worstSellingProducts = async ({limit = 5}) => {
    const products: Array<Product> = await AppDataSource.manager.find(Product);
    products.sort((a: Product, b: Product) => {
        return a.numberOfSales - b.numberOfSales;
    });
    return products.slice(0, limit);
};
export const bestSellingProducts = async ({limit = 5}) => {
    const products: Array<Product> = await AppDataSource.manager.find(Product);
    products.sort((a: Product, b: Product) => {
        return b.numberOfSales - a.numberOfSales;
    });
    return products.slice(0, limit);
};

export const getAllProducts = async () => {
    return await AppDataSource.manager.find(Product);
};

export const searchForProducts = async ({name}) => {
    const nameLower = name.toLowerCase();
    const product = await productRepository.createQueryBuilder("product").where("LOWER(product.name)" +
        " like :name", {name: `%${nameLower}%`}).getMany();
    if (product.length === 0 || !product) throw new Error(`There is no product containing '${name}'`);
    return product;
};
export const productStatus = async ({name}) => {
    const nameLower = name.toLowerCase();
    const product = await productRepository.createQueryBuilder("product").where("LOWER(product.name)" +
        " like :name", {name: `%${nameLower}%`}).getOne();
    if (!product) return {message: `There is no product containing '${name}'`};
    const status = product.quantity > 0 ? "Available" : "Sold Out";
    return {name: product.name, status: status};
};

