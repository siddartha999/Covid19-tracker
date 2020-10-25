import React from 'react';
import { Map as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import {showDataOnMap} from "../../util";

const Map = (props) => {
    return (
        <div className="Map">
            <LeafletMap center={props.center} zoom={props.zoom}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {showDataOnMap(props.countries, props.casesType)}
            </LeafletMap>
        </div>
    );
};

export default Map;