import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';
import { DeleteMaintenances } from './DeleteMaintenances';
import { InsertModalMaintenances } from './InsertModalMaintenances';

export const Maintenances = ({token, canWrite}) => {

    const [deleted, setDeleted] = useState(false);
    const [maintenance, setMaintenance] = useState([]);
    const [insertMaintenances, setInsertMaintenances] = useState(false);

    const getMaintenances = async() => {
        const response = await postQuery({
            query: `query show_maintenances {
                maintenances(where: {deleted: {_eq: ${deleted}}}) {
                  id
                  machineType
                  frequency
                  type
                  deleted
                }
              }`
        },
        token);
        setMaintenance(response?.maintenances || []);
    }

    useEffect(() => {
        getMaintenances();
    }, [deleted])

    const delMaintenance = async(id, deleted, token) => {
        const result = await postQuery({
            query: `mutation toggleMaintenance {
                update_maintenances(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                  affected_rows
                }
              }`
        },
        token);
        const newMaintenanceList = maintenance.filter( element => element.id !== id );
        setMaintenance(newMaintenanceList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Maintenance Types</h3>
            {
              canWrite ? <button onClick={ () => { setInsertMaintenances(!insertMaintenances)} } type="button">Add</button> : ''
            }
            {
                insertMaintenances ? <InsertModalMaintenances getMaintenances={getMaintenances} token={token} insertMaintenances={insertMaintenances} setInsertMaintenances={setInsertMaintenances}/> : ''
            }
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <div>
                {
                    <table align='center' width='100%'>
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> MaintenanceType </th>
                                <th> MachineType </th>
                                <th> Frequency </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenance.map( maintenance => (
                                    <tr key={maintenance.id}>
                                        <td> {maintenance.id} </td>
                                        <td> {maintenance.type} </td>
                                        <td> {maintenance.machineType} </td>
                                        <td> {maintenance.frequency} </td>
                                        <DeleteMaintenances id={maintenance.id} deleted={maintenance.deleted} delMaintenance={delMaintenance} token={token}/>
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
