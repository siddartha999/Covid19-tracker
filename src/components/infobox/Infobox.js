import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import "./Infobox.css";
import {formatStat} from "../../util";

const Infobox = (props) => {
    return (
        <Card className={`Infobox ${props.active && 'active'}`} onClick={props.updateCasesType} casestype={props.casesType || "cases"}>
            <div className="Infobox-border-top"></div>
            <CardContent>
                <Typography variant="h5" component="h2">{props.title || "Covid19"}</Typography>
                <Typography variant="body2" component="p">Today: {formatStat(props.today)}</Typography>
                <Typography >Total: {formatStat(props.total)}</Typography>
            </CardContent>
        </Card>
    );
};

export default Infobox;