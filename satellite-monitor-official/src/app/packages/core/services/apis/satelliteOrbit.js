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
export const calOrbit_all_multipoint = (lat, long, time_start, time_end, obs1, obs2, obs3, obs4) => {

    return api.makeRequest({
        url: `satellites/track-all-multipoint`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            lat: lat,
            long: long,
            time_start: time_start,
            time_end: time_end,
            obs1: obs1,
            obs2: obs2,
            obs3: obs3,
            obs4: obs4
        }
    })
}
export const calOrbit_one_multipoint = (lat, long, time_start, time_end, obs1, obs2, obs3, obs4, Norad_Number) => {

    return api.makeRequest({
        url: `satellites/track-one-multipoint`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            lat: lat,
            long: long,
            time_start: time_start,
            time_end: time_end,
            obs1: obs1,
            obs2: obs2,
            obs3: obs3,
            obs4: obs4,
            Norad_Number: Norad_Number
        }
    })
}
export const find_satellite = (key) => {
    return api.makeRequest({
        url: `satellites/find-satellite`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            key: key,
        }
    })
}