import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';
import { InsertModalMachineTypes } from './InsertModalMachineTypes';

import 'sweetalert2/dist/sweetalert2.min.css';
import { DeleteMachineTypes } from './DeleteMachineTypes';

export const MachineTypes = ({token, canWrite}) => {

    const [deleted, setDeleted] = useState(false);
    const [type, setType] = useState([]);
    const [insertMachineType, setInsertMachineType] = useState(false);

    const getTypes = async() => {
        const response = await postQuery({
            query: `query show_types {
                machineType(where: {deleted: {_eq: ${deleted}}}) {
                  name
                  deleted
                }
              }`
        },
        token);
        setType(response?.machineType || []);
    }

    useEffect(() => {
        getTypes();
    }, [deleted])

    const delType = async(name, deleted, token) => {
        const result = await postQuery({
            query: `mutation toggleType {
                update_machineType(where: {name: {_eq: "${name}"}}, _set: {deleted: ${!deleted}}) {
                        affected_rows
                    }
                }`
        },
        token);
        const newTypeList = type.filter( element => element.name !== name );
        setType(newTypeList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Machine Types</h3>
            {
              canWrite ? <button onClick={ () => { setInsertMachineType(!insertMachineType)} } type="button">Add</button> : ''
            }
            {
                insertMachineType ? <InsertModalMachineTypes getTypes={getTypes} token={token} insertMachineType={insertMachineType} setInsertMachineType={setInsertMachineType}/> : ''
            }
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <div>
                {
                    <table align='center' width='100%'>
                        <thead>
                            <tr>
                                <th> Name </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                type.map( type => (
                                    <tr key={type.name}>
                                        <td> {type.name} </td>
                                        <DeleteMachineTypes name={type.name} deleted={type.deleted} delType={delType} token={token}/>
                                        {/* <td>
                                            <button onClick={() => delType(type.name)} type="button">Delete</button>
                                        </td> */}
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
