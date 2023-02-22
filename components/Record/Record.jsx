import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';
import { InsertModalRecord } from './InsertModalRecord';

//import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { DeleteRecord } from './DeleteRecord';

export const Record = () => {

    const [deleted, setDeleted] = useState(false);
    const [record, setRecord] = useState([]);

    const getRecord = async() => {
        const {controlMaintenanceRecord} = await postQuery({
            query: `query show_record {
                controlMaintenanceRecord(where: {deleted: {_eq: ${deleted}}}) {
                  id
                  date
                  status
                  machineId
                  managerId
                  observation
                  maintenanceId
                  deleted
                }
              }`
        });
        setRecord(controlMaintenanceRecord);
    }

    useEffect(() => {
        getRecord();
    }, [deleted])

    const delRecord = async(id, deleted) => {
        const result = await postQuery({
            query: `mutation toggleRecord {
                update_controlMaintenanceRecord(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                  affected_rows
                }
              }`
        });
        const newRecordList = record.filter( element => element.id !== id);
        setRecord(newRecordList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Control/Maintenance Record</h3>
            <InsertModalRecord getRecord={getRecord} />
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <div>
                {
                    <table align='center' width='100%'>
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> Date </th>
                                <th> Status </th>
                                <th> MachineId </th>
                                <th> ManagerId </th>
                                <th> MaintenanceId </th>
                                <th> Observation </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                record.map( record => (
                                    <tr key={record.id}>
                                        <td> {record.id} </td>
                                        <td> {record.date} </td>
                                        <td> {record.status} </td>
                                        <td> {record.machineId} </td>
                                        <td> {record.managerId} </td>
                                        <td> {record.maintenanceId} </td>
                                        <td> {record.observation} </td>
                                        <DeleteRecord id={record.id} deleted={record.deleted} delRecord={delRecord}/>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}
