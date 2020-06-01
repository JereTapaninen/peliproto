export const collectionToArray = collection => {
    const newArray = [];
    for (let i = 0; i < collection.length; i++) {
        newArray[i] = collection.item(i);
    }
    return newArray;
};

export const nextFloat = (min, max) => {
    return (Math.random() * (max + 1)) - Math.abs(min);
};

export const clamp = (value, min, max) =>
    value < min ? min : value > max ? max : value;
