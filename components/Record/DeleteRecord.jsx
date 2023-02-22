export const DeleteRecord = ({id, deleted, delRecord}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delRecord(id, deleted)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delRecord(id, deleted)} type="button">Delete</button>
            </td>
        )
    }   
}
