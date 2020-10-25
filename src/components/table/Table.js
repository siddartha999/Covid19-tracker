import React, {useState} from 'react';
import "./Table.css";
import numeral from "numeral";
import { v4 as uuidv4 } from 'uuid';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const SORT_BY_OPTIONS = {
    "COUNTRY.ASC": "COUNTRY.ASC",
    "COUNTRY.DESC": "COUNTRY.DESC",
    "CASES.ASC": "CASES.ASC",
    "CASES.DESC": "CASES.DESC"
};

const Table = (props) => {
    const [sortby, setSortBy] = useState(SORT_BY_OPTIONS["COUNTRY.ASC"]);
    
    /**
     * Handler to handle the change in sort by order of the world-wide live cases  
     */
    const handleSortByChange = (event) => {
        const value = event.target.value;
        setSortBy(event.target.value);
        if(value === SORT_BY_OPTIONS["COUNTRY.ASC"]) {
            props.sortDataByName(true);
        }
        else if(value === SORT_BY_OPTIONS["COUNTRY.DESC"]) {
            props.sortDataByName(false);
        }
        else if(value === SORT_BY_OPTIONS["CASES.ASC"]) {
            props.sortDataByCases(true);
        }
        else {
            props.sortDataByCases(false);
        }
      };

    return (
        <>
        <div className="Table-header">
            <p>{props.title}</p>
            <div className="Table-header-sortby-option">
            <FormControl>
                <InputLabel id="demo-simple-select-helper-label">Sort by</InputLabel>
                <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={sortby}
                onChange={handleSortByChange}
                >
                <MenuItem value={SORT_BY_OPTIONS["COUNTRY.ASC"]}>Country: ⬆</MenuItem>
                <MenuItem value={SORT_BY_OPTIONS["COUNTRY.DESC"]}>Country: ⬇</MenuItem>
                <MenuItem value={SORT_BY_OPTIONS["CASES.ASC"]}>Cases: ⬆</MenuItem>
                <MenuItem value={SORT_BY_OPTIONS["CASES.DESC"]}>Cases: ⬇</MenuItem>
                </Select>
            </FormControl>
            </div>
        </div>
        <div className="Table">
            <div className="Table-content">
                <table>
                    <tbody>
                        {
                            props.data.map(country => 
                                <tr key={uuidv4()}>
                                    <td>{country.country}</td>
                                    <td><strong>{numeral(country.cases).format("0,0")}</strong></td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default Table;