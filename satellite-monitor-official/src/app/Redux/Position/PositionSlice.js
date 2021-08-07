import { createSlice } from '../../packages/core/adapters/redux-toolkit';

import { calculate_orbit, getSatelliteInfo, updateSatelliteDatabase, stopUpdateSatelliteDatabase } from './positionAction';

const positionSlice = createSlice({
    name: 'position',
    initialState: {
        // Tọa độ muốn tiên đoán - Tọa độ muốn kiểm tra các vệ tinh sẽ đi qua trong khoảng thời gian
        predictPoint: [0, 0],
        // Vị trí trung tâm của bản đồ
        center: [21.020243495690448, 105.84110184937984], //[21, 105]
        // Danh sách vệ tinh đi qua tọa độ X trong khoảng thời gian (số lượng dựa trên bộ lọc)
        listSatellite: [],
        // Vệ tinh đang xét tại 1 thời điểm 
        currentSatellite: {'detail':{},'info':{}},
        // 5 thời điểm của vệ tinh đang xét
        listPosition:[],
        // Tổng số vệ tinh đi qua tọa độ X trong khoảng thời gian (số lượng dựa trên bộ lọc)
        totalSatellite: 0,
        // Danh sách vệ tinh đi qua tọa độ X trong khoảng thời gian (không lọc)
        baseListSatellite: [],
        // Tổng số vệ tinh đi qua tọa độ X trong khoảng thời gian
        baseTotalSatellite: 0,
        // Trạng thái quá trình update: 0 - không update, 1 - đang update, 2 thành công, -1 - lỗi
        updateState: 0,
        // Phản hồi từ quá trình update
        updateResponse: {'status': true, 'count': 0},
        // Kết quả của stop update
        stopUpdateState: true,
    },
    reducers: {
        setPredictPoint: (state, action) => {
            console.log('Predict Point:', action.payload);
            state.predictPoint = action.payload;
        },
        setCenter: (state, action) => {
            console.log('Center:', action.payload);
            state.center = action.payload;
        },
        setListPolyline: (state, action) => {
            state.listPolyline = [];

            action.payload.forEach(element => {
                state.listPolyline.push(element);
            });
        },
        setCurrentSatellite: (state, action) => {
            state.currentSatellite.detail = {...action.payload}
            // console.log(state.currentSatellite.detail);
        },
        setListPosition: (state, action) => {
            state.listPosition = action.payload
            console.log('list: ', action.payload)
        },
        filterSatellite: (state, action) => {
            // console.log(action.payload)
            state.listSatellite = action.payload
            state.totalSatellite = state.listSatellite.length
        },
        setUpdateState: (state, action) => {
            state.updateState = action.payload;
            console.log(state.updateState)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(calculate_orbit.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    ('message' in action.payload.data && action.payload.data.message === 'error')){
                console.log('Error Calculate');
                return
            }
            else {
                state.listSatellite = action.payload.data
                state.baseListSatellite = action.payload.data
                state.totalSatellite = state.baseTotalSatellite = state.listSatellite.length;
            }
            // console.log('fulfilled', state.baseListSatellite);
        })
        builder.addCase(getSatelliteInfo.fulfilled, (state, action) => {
            state.currentSatellite.info = action.payload.data;
            // console.log('fulfilled', state.currentSatellite.info);
        })
        builder.addCase(updateSatelliteDatabase.fulfilled, (state, action) => {
            state.updateResponse = action.payload.data;
            state.updateState = action.payload.data.status ? 2 : -1;
            console.log('Message:', state.updateResponse.message);
        })
        builder.addCase(stopUpdateSatelliteDatabase.fulfilled, (state, action) => { // Chỉ dùng để debug
            console.log('Message:', action.payload.data.message); 
        })
    }
})

export const {
    setCenter,
    setListPolyline,
    setCurrentSatellite,
    setListPosition,
    filterSatellite,
    setUpdateState,
    setPredictPoint
} = positionSlice.actions;
export default positionSlice.reducer;