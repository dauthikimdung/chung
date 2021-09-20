
const OneSateOfSatellite = ({ item }) => {

    return (
            <tr>
                <td>{item.trvn}</td>
                <td>{Number.parseFloat(item.alt.toFixed(6))}</td>
                <td>{item.az.toFixed(6)}</td>
                <td>{item.lat.toFixed(6)}</td>
                <td>{item.long.toFixed(6)}</td>
                <td>{item.elevation}</td>
                <td>{item.range}</td>                
                <td>{item.location}</td>
            </tr>
    );
};

export default OneSateOfSatellite;
// .toExponential(4)