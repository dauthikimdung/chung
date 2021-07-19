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

export const calOrbit = () => {

}