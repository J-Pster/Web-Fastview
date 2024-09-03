import DataTable from 'react-data-table-component';
import axios from "axios";
import "./style.css";

export default function DataTableBase(props) {

    return (
        <DataTable
            keyField={props.keyField}
            title={props.title}
            columns={props.columns}
            data={props.data}
            onRowClicked={props.onRowClicked}
        />
    )
}