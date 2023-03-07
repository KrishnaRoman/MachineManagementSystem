export const DeleteMaintenances = ({id, deleted, delMaintenance, token, defaultRole}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted, token, defaultRole)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted, token, defaultRole)} type="button">Delete</button>
            </td>
        )
    }  
}
