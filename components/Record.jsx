import {useEffect, useState} from 'react';
import {postQuery} from '../helpers/postQueries';
import { InsertModalRecord } from './InsertModalRecord';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const Record = () => {

    const [record, setRecord] = useState([]);

    const getRecord = async() => {
        const {controlMaintenanceRecord} = await postQuery({
            query: `query show_record {
                controlMaintenanceRecord {
                  id
                  date
                  status
                  machineId
                  managerId
                  observation
                  maintenanceId
                }
              }`
        });
        setRecord(controlMaintenanceRecord);
    }

    useEffect(() => {
        getRecord();
    }, [])

    const delRecord = async(id) => {
        const result = await postQuery({
            query: `mutation del_record {
                delete_controlMaintenanceRecord(where: {id: {_eq: ${id}}}){
                  affected_rows
                }
              }`
        });
        if (result && result.delete_controlMaintenanceRecord.affected_rows === 1){
            const newRecordList = record.filter( element => element.id !== id);
            setRecord(newRecordList);
        }else{
            Swal.fire('Delete error', 'There was an error deleting that record', 'There was an error deleting that record');
        }
    }

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Control/Maintenance Record</h3>
            <InsertModalRecord getRecord={getRecord} />
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
                                        <td>
                                            <button onClick={() => delRecord(record.id)} type="button">Delete</button>
                                        </td>
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
