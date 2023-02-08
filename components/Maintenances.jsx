import {useEffect, useState} from 'react';
import {postQuery} from '../helpers/postQueries';

const delMaintenance = async(id) => {
    const result = await postQuery({
        query: `mutation del_machine {
            delete_machines(where: {id: {_eq: ${id}}}){
              affected_rows
            }
          }`
    });
}

export const Maintenances = () => {

    const [maintenance, setMaintenance] = useState([]);

    const getMaintenances = async() => {
        const {maintenances} = await postQuery({
            query: `query show_maintenances {
                maintenances {
                  id
                  machineType
                  frequency
                  type
                  
                }
              }`
        });
        //console.log(machines);
        setMaintenance(maintenances);
    }

    useEffect(() => {
        getMaintenances();
    }, [])

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Maintenance Types</h3>
            <div>
                {
                    <table align='center' width='100%'>
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> MachineType </th>
                                <th> Frequency </th>
                                <th> Type </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                maintenance.map( maintenance => (
                                    <tr key={maintenance.id}>
                                        <td> {maintenance.id} </td>
                                        <td> {maintenance.machineType} </td>
                                        <td> {maintenance.frequency} </td>
                                        <td> {maintenance.type} </td>
                                        <td>
                                            <button onClick={() => console.log(maintenance.id)} type="button">Delete</button>
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
