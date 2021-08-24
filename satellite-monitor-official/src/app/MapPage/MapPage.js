import './MapPage.css';

import './MapPage.css';
import React, { Fragment } from 'react';

import Layout from '../packages/shared/layouts';
import MapActions from './components/MapActions';
import MapContent from './components/MapContent';
import MapDetail from './components/MapDetail';
import SatelliteSearch from './components/SatelliteSearch';
export default function MapPage() {
    return (
        <Fragment>
            <Layout>
                <div className='map-wrapper'>
                    <MapActions />
                    <SatelliteSearch />
                </div>                
                <div className='map-wrapper' >
                    <MapContent />
                    <MapDetail />
                </div>
            </Layout>
        </Fragment>
    )
}
