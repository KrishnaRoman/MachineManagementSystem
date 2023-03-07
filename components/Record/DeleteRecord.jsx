export const DeleteRecord = ({id, deleted, delRecord, token, defaultRole}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delRecord(id, deleted, token, defaultRole)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delRecord(id, deleted, token, defaultRole)} type="button">Delete</button>
            </td>
        )
    }   
}
