import './MapContent.css';
import { useState, useEffect}  from 'react'
import { useSelector } from 'react-redux';
import { Polygon } from '../../packages/core/adapters/leaflet-map';
const MapSelectArea = ({polygonDisplay}) => {
    const { interfaceMapActionState } = useSelector(state => state.positionReducer);
    const [ check, setCheck ] = useState(false)
    useEffect(() => {
        setCheck(true)
        polygonDisplay.map(item => {
            if(item.lat === '' || item.lng === ''){
                setCheck(false)
                console.log(check)
            }            
        })
    }, [polygonDisplay])
    return (
        <>
        {
            (check & !interfaceMapActionState) ?
                <Polygon
                    key={Math.random()}
                    positions={polygonDisplay.map((item,index) => [item.lat, item.lng])}
                        // arrowheads={{ size: '20px', fill: true, frequency: 'allvertices' }}
            />
            :
            <></>
        }
        </>
              
    );
}

export default MapSelectArea;
// const powValueLine = (point1, point2) => {
    //     return (point1.lng-point2.lng)*(point1.lng-point2.lng) + (point1.lat-point2.lat)*(point1.lat-point2.lat)
    // }
        // if (temp1 === 0 && temp2 ===0){ // nếu 4 điểm nằm trên 1 đường thẳng thì điểm trung tâm nằm trên đường thẳng là được
        //     if(line.a * center.lng - center.lat + line.b) return true
        // }
        // if (temp1 === 0 && temp2 !==0) { // nếu điểm point3 nằm trên đường thẳng
        //     let AB = powValueLine(point1, point2)
        //     let BC = powValueLine(point2, point3)
        //     let AC = powValueLine(point3, point1)
        //     if (AB === Math.max(AB, BC, AC))
        //     return 
        // }