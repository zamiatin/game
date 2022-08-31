## Part 1:
I prefer to use Object. It's easier to update state by id.
```js
{id: { // unique id
    x: 0, // position by X-axis 
    y: 0, // position by Y-axis
    type: HOLE_TYPE, // type of cell 'hole/simple'
    isOpen: false, // state of cell 'opened/closed'
    adjacentCount: 0, // adjacent number of 'black holes'
    adjacentIds: EMPTY_ARRAY, // adjacent ids of simple cells
    },
{}};
```
## Part 2:
/utils.js :50-54

```js
const computedArr = [
    ...Array(blackHoles).fill().map(() => ({[uuidv4()]: emptyHole})),
    ...Array(width*height - blackHoles).fill().map(() => ({[uuidv4()]: emptyItem})),
    ]
    .sort((a, b) => {return Object.keys(a)[0].localeCompare(Object.keys(b)[0])});
```

## Part 3
/utils.js :33-46

```js
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
```

## Part 4
/utils.js :70-78
```js
export const updateLayout = (layout, currentObj) => {
    const key = Object.keys(currentObj)[0];
    const objLayout = transformToObject(layout);
    objLayout[key].isOpen = true;
    objLayout[key].adjacentIds.forEach((id) => {
        objLayout[id].isOpen = true;
    });
    return transformToArray(objLayout);
};
```