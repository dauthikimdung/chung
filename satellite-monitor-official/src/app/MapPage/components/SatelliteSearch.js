// import './SatelliteSearch.css';

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
    const searchResult = (query: string) => {
        new Array(5)
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
                <a
                    href={`https://s.taobao.com/search?q=${query}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {category}
                </a>
                </span>
                <span>{100} results</span>
            </div>
            ),
        };
        });
    }
    

        const [options, setOptions] = useState([]);

        const handleSearch = (value: string) => {
            setOptions(value ? searchResult(value) : []);
        };

        const onSelect = (value: string) => {
            console.log('onSelect', value);
        }
    return (
        <>
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item >
                    <AutoComplete
                        dropdownMatchSelectWidth={252}
                        style={{ width: 300 }}
                        options={options}
                        onSelect={onSelect}
                        onSearch={handleSearch}
                        >
                        <Input.Search size="large" placeholder="Số NORAD hoặc Tên" style={{ width: '50px' }} enterButton />
                    </AutoComplete>
                    </Form.Item>                   
                    <Form.Item>
                        <Button />
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}
export default SatelliteSearch;
