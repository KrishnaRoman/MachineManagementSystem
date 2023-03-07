export const DeleteRecord = ({id, deleted, delRecord, token}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delRecord(id, deleted, token)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delRecord(id, deleted, token)} type="button">Delete</button>
            </td>
        )
    }   
}
