import { createAsyncThunk } from '../../packages/core/adapters/redux-toolkit';
import { calOrbit_all, calSatellite, updateDatabase, stopUpdateDatabase, 
calOrbit_all_multipoint } from '../../packages/core/services/apis/satelliteOrbit';

const calculate_orbit = createAsyncThunk(
    'position/calOrbitAll',
    async (param, { dispatch, getState }) => {
        //const center = getState().positionReducer;
        // console.log('res: ',param);
        const res = await calOrbit_all(param.lat, param.long, param.time_start, param.time_end);
        // console.log('res: ',res);
        return {data: res};
    }
)
const getSatelliteInfo = createAsyncThunk(
    'position/getSatelliteInfo',
    async (name, { dispatch, getState }) => {
        console.log(name)
        //const center = getState().positionReducer;
        const res = await calSatellite(name);
        console.log('res-get: ',res);
        return {data: res};
    }
)
const updateSatelliteDatabase = createAsyncThunk(
    'position/updateDatabase',
    async (param, { dispatch, getState }) => {
        const res = await updateDatabase();
        console.log('res-update: ',res);
        return {data: res};
    }
)
const stopUpdateSatelliteDatabase = createAsyncThunk(
    'position/stopUpdateDatabase',
    async (param, { dispatch, getState }) => {
        const res = await stopUpdateDatabase();
        console.log('res-stop-update: ',res);
        return {data: res};
    }
)
const calculate_orbit_multipoint = createAsyncThunk(
    'position/calOrbitAllMultipoint',
    async (param, { dispatch, getState }) => {
        //const center = getState().positionReducer;
        // console.log('res: ',param);
        const res = await calOrbit_all_multipoint(param.lat, param.long, param.time_start, param.time_end, 
                                                    param.obs1, param.obs2, param.obs3, param.obs4);
        console.log('res: ',res[0]);
        return {data: res};
    }
)
export {
    calculate_orbit,
    getSatelliteInfo,
    updateSatelliteDatabase,
    stopUpdateSatelliteDatabase,
    calculate_orbit_multipoint
}