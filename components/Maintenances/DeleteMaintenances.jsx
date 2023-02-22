export const DeleteMaintenances = ({id, deleted, delMaintenance}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMaintenance(id, deleted)} type="button">Delete</button>
            </td>
        )
    }  
}
