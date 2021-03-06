import { createSlice } from '../../packages/core/adapters/redux-toolkit';
import L from 'leaflet'
import { calculate_orbit, getSatelliteInfo, updateSatelliteDatabase, stopUpdateSatelliteDatabase,
    calculate_orbit_multipoint, calculate_orbit_multipoint_one, search_list_names,
    find_satellite_info, load_all_nation_satellite} from './positionAction';

const positionSlice = createSlice({
    name: 'position',
    initialState: {
        // Vị trí trung tâm của bản đồ
        center: [21.020243495690448, 105.84110184937984], //[21, 105]
        // Danh sách vệ tinh đi qua tọa độ X trong khoảng thời gian (số lượng dựa trên bộ lọc)
        listSatellite: [],
        // Vệ tinh đang xét tại 1 thời điểm 
        currentSatellite: {'detail':{},'info':{}},
        // 12 thời điểm của vệ tinh đang xét
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
        // Danh sách các điểm để dự đoán vệ tinh đi qua 
        listPredictPoint: [],
        // Quy định giao diện chọn 1 điểm hay nhiều điểm: true : 1 điểm, false: nhiều điểm
        interfaceMapActionState: false,
        // Điểm đang lựa chọn
        indexPredictPoint: 0,
        // Tọa độ muốn tiên đoán - Tọa độ muốn kiểm tra các vệ tinh sẽ đi qua trong khoảng thời gian ==> coordinateOfMarkers[0]
        // Tọa độ các điểm lựa chọn
        coordinateOfMarkers: [{lat:'', lng:''},{lat:'', lng:''},{lat:'', lng:''},{lat:'', lng:''},{lat:'', lng:''},],
        // Điểm trung tâm có nằm bên trong 4 đỉnh không
        isInside: 0,
        // Trạng thái quá trình lấy dữ liệu vệ tinh: 0 - không, 1 - đang, 2 thành công, -1 - lỗi
        getSatellitesState: 0,
        rangeTime: [], 
        // Danh sách tên cho tìm kiếm
        listNameSatellites: {
            'listName': [],
            'totalLength' : 0,
            'totalName': []
        },
        //
        satelliteSearchInfo: {},

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
        setlistPosition: (state, action) => {
            state.listPosition = action.payload
            console.log('list 12: ', action.payload)
        },
        filterSatellite: (state, action) => {
            // console.log(action.payload)
            state.listSatellite = action.payload
            state.totalSatellite = state.listSatellite.length
        },
        setUpdateState: (state, action) => {
            state.updateState = action.payload;
            // console.log(state.updateState)
        },
        setListPredictPoint: (state, action) => {
            state.listPredictPoint[action.payload.index] = action.payload.point;
            console.log(action.payload.index, action.payload.point)
        },
        setIndexPredictPoint: (state, action) => {
            state.indexPredictPoint = action.payload;
            // console.log(action.payload)
        },
        setInterfaceMapActionState: (state, action) => {
            state.interfaceMapActionState = action.payload;
            // console.log(state.interfaceMapActionState)
        },
        setCoordinateOfMarkers: (state, action) => {
            state.coordinateOfMarkers = action.payload;
            // console.log(state.interfaceMapActionState)
        },
        setIsInside: (state, action) => {
            state.isInside = action.payload;
            // console.log(state.interfaceMapActionState)
        },
        setGetSatellitesState: (state, action) => {
            state.getSatellitesState = action.payload;
            // console.log(state.interfaceMapActionState)
        },
        setRangeTime: (state, action) => {
            state.rangeTime = action.payload;
            // console.log(state.interfaceMapActionState)
        },
    },
    extraReducers: (builder) => {
        builder.addCase(calculate_orbit.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    ('message' in action.payload.data && action.payload.data.message === 'error')){
                console.log('Error Calculate');
                state.getSatellitesState = -1
            }
            else {
                state.listSatellite = action.payload.data
                state.baseListSatellite = action.payload.data
                state.totalSatellite = state.baseTotalSatellite = state.listSatellite.length;
                state.getSatellitesState = 2
                return
            }
            state.getSatellitesState = -1

            // console.log('fulfilled', state.baseListSatellite);
        })
        builder.addCase(getSatelliteInfo.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    ('message' in action.payload.data && action.payload.data.message === 'error')){
                console.log('Error Get Satellite Info');
            }
            else {
                state.currentSatellite.info = action.payload.data;
            }
            
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
        builder.addCase(calculate_orbit_multipoint.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    ('message' in action.payload.data && action.payload.data.message === 'error')){
                console.log('Error Calculate');
            }
            else if (action.payload.data === undefined)
                console.log('Error Network');
            else {
                state.listSatellite = action.payload.data
                state.baseListSatellite = action.payload.data
                state.totalSatellite = state.baseTotalSatellite = state.listSatellite.length;
                state.getSatellitesState = 2
                return
            }
            state.getSatellitesState = -1
            // console.log('fulfilled', state.baseListSatellite);
        })
        builder.addCase(calculate_orbit_multipoint_one.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    ('message' in action.payload.data && action.payload.data.message === 'error')){
                console.log('Error Calculate');
            }
            else if (action.payload.data.coordinate === undefined)
                console.log('Error Network');
            else {
                state.listPosition = action.payload.data.coordinate
                console.log(action.payload.data.coordinate);
                return
            }
            state.getSatellitesState = -1
        })
        builder.addCase(search_list_names.fulfilled, (state, action) => {
            state.listNameSatellites = action.payload.data
        })
        builder.addCase(find_satellite_info.fulfilled, (state, action) => {
            if (action.payload.data === undefined || 
                    (action.payload.data === 'Error')){
                console.log('Error search');
            }
            else {
                state.satelliteSearchInfo = action.payload.data
                console.log(action.payload.data)
            }
                
        })
        
    }
})

export const {
    setCenter,
    setListPolyline,
    setCurrentSatellite,
    setlistPosition,
    filterSatellite,
    setUpdateState,
    setPredictPoint,
    setListPredictPoint,
    setInterfaceMapActionState,
    setIndexPredictPoint,
    setCoordinateOfMarkers,
    setIsInside,
    setGetSatellitesState,
    setRangeTime
} = positionSlice.actions;
export default positionSlice.reducer;