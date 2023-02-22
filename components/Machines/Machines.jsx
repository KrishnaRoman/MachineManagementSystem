import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';
import { InsertModalMachines } from './InsertModalMachines';

import 'sweetalert2/dist/sweetalert2.min.css';
import { DeleteMachines } from './DeleteMachines';

export const Machines = () => {

    const [deleted, setDeleted] = useState(false);
    const [machine, setMachine] = useState([]);

    const getMachines = async() => {
        const {machines} = await postQuery({
            query: `query show_machine {
                machines(where: {deleted: {_eq: ${deleted}}}) {
                  id
                  location
                  operationStartDate
                  type
                  deleted
                }
              }`
        });
        setMachine(machines);
    }

    useEffect(() => {
        getMachines();
    }, [deleted])

    const delMachine = async(id, deleted) => {
        const result = await postQuery({
            query: `mutation toggleMachines {
            update_machines(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                    affected_rows
                }
            }`
        });
        const newMachineList = machine.filter( element => element.id !== id );
        setMachine(newMachineList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    return (
        <>
            <h3>Machines</h3>
            <InsertModalMachines getMachines={getMachines} />
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <div>
                {
                    <table align="center" width="100%">
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> Type </th>
                                <th> Location </th>
                                <th> OperationStartDate </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                machine.map( machine => (
                                    <tr key={machine.id}>
                                        <td> {machine.id} </td>
                                        <td> {machine.type} </td>
                                        <td> {machine.location} </td>
                                        <td> {machine.operationStartDate} </td>
                                        <DeleteMachines id={machine.id} deleted={machine.deleted} delMachine={delMachine}/>
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
