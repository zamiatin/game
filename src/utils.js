import {v4 as uuidv4} from 'uuid';
export const SIMPLE_TYPE = 'simple';
export const HOLE_TYPE = 'hole';
const EMPTY_OBJECT = {};
const EMPTY_ARRAY = [];

const emptyHole = {
    x: 0,
    y: 0,
    type: HOLE_TYPE,
    isOpen: false,
  };

const emptyItem = {
    x: 0,
    y: 0,
    type: SIMPLE_TYPE,
    isOpen: false,
    adjacentCount: 0,
    adjacentIds: EMPTY_ARRAY,
  };

  const getMatrix = (arr, width, height) => {
    let count = 0;
    const matrix = Array(height).fill().map(() => Array(width).fill().map(() => {
        const item = arr[count];
        count++;
        return item;
    }));
    return matrix;
  };

  const getAdjCount = (matrix, type, indexX, indexY) => {
    const adjacentItems = [
        matrix[indexY - 1]?.[indexX - 1],
        matrix[indexY - 1]?.[indexX],
        matrix[indexY - 1]?.[indexX + 1],
        matrix[indexY][indexX - 1],
        matrix[indexY][indexX + 1],
        matrix[indexY + 1]?.[indexX - 1],
        matrix[indexY + 1]?.[indexX],
        matrix[indexY + 1]?.[indexX + 1]
    ]
    const adjacentCount = adjacentItems.filter((current) => type === SIMPLE_TYPE && Object.values(current || EMPTY_OBJECT)[0]?.type === HOLE_TYPE).length;
    const adjacentIds = adjacentCount == 0 ? adjacentItems.filter((current) => !!current).map((o) => Object.keys(o)[0]) : EMPTY_ARRAY;
    return {adjacentCount, adjacentIds};
}

export const generateLayout = (width, height, blackHoles) => {
  const computedArr = [
    ...Array(blackHoles).fill().map(() => ({[uuidv4()]: emptyHole})),
    ...Array(width*height - blackHoles).fill().map(() => ({[uuidv4()]: emptyItem})),
    ]
    .sort((a, b) => {return Object.keys(a)[0].localeCompare(Object.keys(b)[0])});

    const matrix = getMatrix(computedArr, width, height);
    const result = computedArr.map((obj, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        const {adjacentCount, adjacentIds} = getAdjCount(matrix, Object.values(obj)[0].type, x, y);
        return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, {...value, x, y, adjacentCount, adjacentIds}]));
    })

    return result;
};

const transformToObject = (arr) => Object.fromEntries(arr.map((o) => [Object.keys(o)[0], Object.values(o)[0]]));
const transformToArray = (obj) => Object.entries(obj).map(([key, value]) => ({[key]: value}));

export const updateLayout = (layout, currentObj) => {
    const key = Object.keys(currentObj)[0];
    const objLayout = transformToObject(layout);
    objLayout[key].isOpen = true;
    objLayout[key].adjacentIds.forEach((id) => {
        objLayout[id].isOpen = true;
    });
    return transformToArray(objLayout);
};

export const openHoles = (layout) => layout.map((o) => {
    const key = Object.keys(o)[0];
    const value = o[key];
    if (value.type === HOLE_TYPE) {
        return {[key]: {...value, isOpen: true}};
    }
        return o;
    });