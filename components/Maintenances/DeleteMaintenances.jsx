export const DeleteMaintenances = ({id, deleted, delMaintenance, token}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted, token)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted, token)} type="button">Delete</button>
            </td>
        )
    }  
}
