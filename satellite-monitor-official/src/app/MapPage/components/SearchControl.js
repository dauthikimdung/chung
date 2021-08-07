import { MapControl, withLeaflet } from 'react-leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import { connect } from 'react-redux';
import { setCenter, setPredictPoint } from '../../Redux/Position';
import L from 'leaflet' // Thư viện truy vấn ngược Địa điểm theo Tọa độ
import LCG from 'leaflet-control-geocoder'
class SearchMap extends MapControl {

    constructor(props, context) {
        super(props);
    }

    createLeafletElement() {
        const provider = new OpenStreetMapProvider();
        const searchControl = new SearchControl({
            provider: provider,
            style: 'bar',
            showMarker: true,
            showPopup: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false,
            searchLabel: 'Tìm kiếm',
        });

        return searchControl;


    }

    componentDidMount() {
        const { map } = this.props.leaflet;
        map.addControl(this.leafletElement);
        map.on('geosearch/showlocation', e => {
            // console.log('get result', e.location);
            let arr = [0, 0];
            arr[0] = e.location.y;
            arr[1] = e.location.x;
            this.props.setCenter(arr);
            this.props.setPredictPoint(arr);
        });
        const geocoder = L.Control.Geocoder.nominatim();
        let marker;
        map.on("click", e => {
        console.log( map.getZoom())
        geocoder.reverse(
            e.latlng,
            map.options.crs.scale(map.getZoom()),
            (results) => {
            var r = results[0];
            console.log(results)
            if (r) {
                if (marker) {
                marker
                    .setLatLng(r.center)
                    .setPopupContent(r.html || r.name)
                    .openPopup();
                } else {
                marker = L.marker(r.center)
                    .bindPopup(r.name)
                    .addTo(map)
                    .openPopup();
                }
            }
            }
        );
        });
    }
}
// Thêm các hàm chức năng
const mapDispatchToProps = dispatch => {
    return {
        setCenter: (arr) => dispatch(setCenter(arr)),
        setPredictPoint: (arr) => dispatch(setPredictPoint(arr))
    }
}
export default withLeaflet(connect(null, mapDispatchToProps)(SearchMap));