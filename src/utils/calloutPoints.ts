

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
                pointIndex: 4
            };
            break;
        case 'top':
            return {
                points: [{
                    x: 0, y: 0
                },  
                {x: 100, y:0},
                {x: 50, y: 0},
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
                pointIndex: 3,
            }
        default:
            return { points: [], pointIndex: -1 };
    }
}