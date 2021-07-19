import './MapDetail.css';

const MapDetail = ({ detail }) => {
    return (
            <table id="map-detail-table">
                <thead>
                <tr>
                    <th>Properties</th>
                    <th>Information</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.keys(detail[2]).map(key => {
                        if (key !== '_id') 
                        return <tr>                
                            <td>{key}</td>
                            <td>{detail[2][key].toString()}</td>
                        </tr>
                    }
                        
                )}
                </tbody>
            
            
            </table>
    )
}

export default MapDetail;
