import createAPIServices from './createAPIServices';

const api = createAPIServices();

export const calOrbit_all = (lat, long, time_start, time_end) => {

    return api.makeRequest({
        url: `satellites/track-all`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            lat: lat,
            long: long,
            time_start: time_start,
            time_end: time_end
        }
    })
}
export const calSatellite = (id) => {
    return api.makeRequest({
        url: `satellites/${id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'text/html'
        },
    })
}
export const updateDatabase = () => {
    return api.makeRequest({
        url: `satellites/update-database`,
        method: 'POST',
    })
}
export const stopUpdateDatabase = () => {
    return api.makeRequest({
        url: `satellites/stop-update-database`,
        method: 'POST',
    })
}
