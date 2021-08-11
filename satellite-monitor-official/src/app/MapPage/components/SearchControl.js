import { MapControl, withLeaflet } from 'react-leaflet';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import { connect, useSelector } from 'react-redux';
import { setCenter, setPredictPoint, setCoordinateOfMarkers } from '../../Redux/Position';
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
            const  indexPredictPoint  = this.props.indexPredictPoint;
            // const  interfaceMapActionState  = this.props.interfaceMapActionState;
            const  coordinateOfMarkers  = this.props.coordinateOfMarkers;
            console.log('get result', e.location);
                let arr = [0, 0];
                arr[0] = e.location.y;
                arr[1] = e.location.x;
                this.props.setCenter(arr);
                // this.props.setPredictPoint(arr);
                let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
                newCoor[indexPredictPoint] = {lat:e.location.y, lng:e.location.x}
                this.props.setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor)));
           
        });        
    }
}
// Thêm các hàm chức năng
const mapDispatchToProps = dispatch => {
    return {
        setCenter: (arr) => dispatch(setCenter(arr)),
        // setPredictPoint: (arr) => dispatch(setPredictPoint(arr)),
        setCoordinateOfMarkers: (newCoor) => dispatch(setCoordinateOfMarkers(newCoor))
    }
}
const mapStateToProps = state => ({
    indexPredictPoint: state.positionReducer.indexPredictPoint,
    // interfaceMapActionState: state.positionReducer.interfaceMapActionState,    
    coordinateOfMarkers: state.positionReducer.coordinateOfMarkers
});
export default withLeaflet(connect(mapStateToProps,mapDispatchToProps)(SearchMap));