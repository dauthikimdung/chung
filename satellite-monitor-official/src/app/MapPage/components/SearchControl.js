import { MapControl, withLeaflet } from 'react-leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import { connect } from 'react-redux';
import { setCenter } from '../../Redux/Position';

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
            console.log('get result', e.location);
            let arr = [0, 0];
            arr[0] = e.location.y;
            arr[1] = e.location.x;
            this.props.setCenter(arr);
        });
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setCenter: (arr) => dispatch(setCenter(arr))
    }
}
export default withLeaflet(connect(null, mapDispatchToProps)(SearchMap));