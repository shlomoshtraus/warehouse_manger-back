import {
    productRepository
} from "../data-source";
import {Product} from "../entity/product";
import {checkIfQuantityIsValid} from "../utils/inputHandler";
import {QueryFailedError} from "typeorm";
import {getFormattedName} from "../utils/getFormattedName";

export const addAnProduct = async ({
                                       name,
                                       quantity,
                                       imgSrc
                                   }) => {
    try {
        const nameFormatted = getFormattedName(name)
        return await productRepository.save({
            name:nameFormatted,
            quantity,
            imgSrc
        });
    } catch (err: any) {
        if (err instanceof QueryFailedError && err.driverError.code === "23505") {
            throw new Error(`Name is already taken: '${name}'`);
        }
    }

};
export const makeASell = async ({
                                    nameOfProduct,
                                    numberOfItemsSold
                                }) => {
    nameOfProduct = getFormattedName(nameOfProduct)
    const nameLower = nameOfProduct.toLowerCase();
    const item: Product = await productRepository.createQueryBuilder("product").where("LOWER(product.name)" +
        " = :name", {name:nameLower}).getOne();
    if (!item)
        throw new Error(`'${nameOfProduct}' doesn't exist!`);
    checkIfQuantityIsValid(item.quantity, numberOfItemsSold);
    item.quantity -= numberOfItemsSold;
    item.numberOfSales++;
    await productRepository.update({name: item.name}, item);
    return item;
};

export const deleteAnProduct = async ({name}) => {
    const nameLower = name.toLowerCase();
    const item: Product = await productRepository.createQueryBuilder("product").where("LOWER(product.name)" +
        " = :name", {name:nameLower}).getOne();
    if (!item)
        throw new Error(`'${name}' doesn't exist!`);
    await productRepository.delete({name:item.name});
    return item;
}

export const changePropertiesOfProduct = async (args) => {
    const {
        previousName,
        ...newProperties
    } = args;
    const previousNameLower = previousName.toLowerCase();
    newProperties.name = getFormattedName(args.name);
    const item: Product = await productRepository.createQueryBuilder("product").where("LOWER(product.name)" +
        " = :name", {name:previousNameLower}).getOne();
    if (!item)
        throw new Error(`Product doesn't exist: '${previousName}'`);
    for (const property in newProperties) {
        const requestedValue = newProperties[property];
        if (requestedValue !== "" && requestedValue != null) {
            item[property] = requestedValue;
        }
    }
    try {
        await productRepository.update({id: item.id}, item);
        return item;
    } catch (err: any) {
        if (err instanceof QueryFailedError && err.driverError.code === "23505")
            throw new Error(`Name is already taken: '${args.name}'`);
    }
}