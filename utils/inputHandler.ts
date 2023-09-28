export function checkIfQuantityIsValid(quantity:number,numberOfItemsSold:number){
    if (quantity - numberOfItemsSold < 0 ||
        numberOfItemsSold < 1)
        throw new Error(`invalid quantity: ${numberOfItemsSold}`)
}