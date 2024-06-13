

export const calloutPoints = (type: string) => {
    switch (type) {
        case 'bottom':
            return {
                points: [{
                    x: 0, y: 0
                }, {
                    x: 100, y: 0
                }, {
                    x: 100, y: 50
                }, {
                    x: 50, y: 50
                }, {
                    x: 60, y: 70
                }, {
                    x: 70, y: 50
                },{
                    x: 0, y: 50
                }], 
                pointIndex: 4,
                widthPointer: {x1: 0, x2: 1},
                heightPointer: {y1: 1, y2: 2}
            };
            break;
        case 'top':
            return {
                points: [{
                    x: 0, y: 0
                },  
                {
                    x: 50, y: 0
                },
                {
                    x: 60, y: -20
                }, 
                {
                    x: 70, y: 0
                }, 
                {
                    x: 100, y: 0
                }, 
                {
                    x: 100, y: 50
                },
                {
                    x: 0, y: 50
                },
                {
                    x: 0, y: 0
                }
            ],
                pointIndex: 4,
                widthPointer: {x1: 0, x2: 4},
                heightPointer: {y1: 4, y2: 5}
            };
            break;
        case 'left':
         return {
            points: [{
                    x: 0, y: 0
                }, {
                    x: 100, y: 0
                }, {
                    x: 100, y: 50
                }, {
                    x: 0, y: 50
                },
                {
                    x: 0, y: 40
                }, {
                    x: -40, y: 30
                }, {
                    x: 0, y: 20
                } , {
                    x: 0, y: 0
                }
               ],
                pointIndex: 5,
                widthPointer: {x1: 0, x2: 1},
                heightPointer: {y1: 1, y2: 2}
            };
            break;
        case 'right': 
          return {
            points: [{
                    x: 0, y: 0
                }, {
                    x: 100, y: 0
                }, {
                    x: 100, y: 20
                }, {
                    x: 120, y: 30
                }, {
                    x: 100, y: 40
                }, {
                    x: 100, y: 50
                }, {
                    x: 0, y: 50
                }
               ],
               pointIndex: 3,
               widthPointer: {x1: 0, x2: 1},
               heightPointer: {y1: 0, y2: 6}
            };
            break;
        default:
            return { points: [], pointIndex: -1 };
    }
}