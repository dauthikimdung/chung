import './SatelliteSearch.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Button, Form, AutoComplete  } from '../../packages/core/adapters/ant-design';
import { SelectProps } from 'antd/es/select';
import { filterSatellite } from '../../Redux/Position';

const SatelliteSearch = () => {
    const dispatch = useDispatch();
    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {

    };
    function getRandomInt(max, min = 0) {
        return Math.floor(Math.random() * (max - min + 1)) + min; // eslint-disable-line no-mixed-operators
    }
    
const searchResult = (query) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
                {category}

            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });
    

    const [options, setOptions] = useState([]);

    const handleSearch = (value: string) => {
        console.log(options, value)
        setOptions(value ? searchResult(value) : []);
    };

    const onSelect = (value: string) => {
        console.log('onSelect', value);
    }
    return (
        <>
            <div className='search-satellite-wrapper'>
                    <AutoComplete
                        dropdownMatchSelectWidth={252}
                        style={{ width: 500, height:50 }}
                        options={options}
                        onSelect={onSelect}
                        onSearch={handleSearch}
                        >
                        <Input.Search size="large" placeholder="Số NORAD hoặc Tên" style={{ width: '400px', height:'50px' }} enterButton />
                    </AutoComplete>
            </div>
        </>
    )
}
export default SatelliteSearch;
