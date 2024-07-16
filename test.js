const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1]
];
directions.forEach(([dRow,dCol]) => {
    console.log(dCol);
});