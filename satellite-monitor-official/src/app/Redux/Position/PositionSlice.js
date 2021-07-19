import { createSlice } from '../../packages/core/adapters/redux-toolkit';

import { calculate_orbit } from './positionAction';


const positionSlice = createSlice({
    name: 'position',
    initialState: {
        center: [0, 0], //[21, 105]
        listPolyline: [],
        listSatellite: [],
        polyline: [
            [
                -0.8899345887083454, 48.269216656952324
            ],
            [
                1.2833992685128601, 49.721639308482615
            ],
            [
                1.3837766890507195, 49.788759577456325
            ],
            [
                18.430162399728452, 61.81659293225455
            ],
            [
                18.430162399728452, 61.81659293225455
            ]
        ]
    },
    reducers: {
        setCenter: (state, action) => {
            //console.log(action.payload);
            state.center = action.payload;
        },
        addPoint: (state, action) => {
            //console.log(action.payload);
            state.polyline.push(action.payload);
        },
        setListPolyline: (state, action) => {
            state.listPolyline = [];

            action.payload.forEach(element => {
                state.listPolyline.push(element);
            });
        }
    },
    extraReducers: (builder) => {
        builder.addCase(calculate_orbit.fulfilled, (state, action) => {
            state.listSatellite = action.payload.data;
            console.log('fulfilled', state.listSatellite);
        })
    }
})

export const {
    setCenter,
    addPoint,
    setListPolyline
} = positionSlice.actions;
export default positionSlice.reducer;