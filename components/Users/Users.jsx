import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';

//import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { InsertModalUsers } from './InsertModalUsers';

export const Users = ({token, canWrite}) => {

    const [users, setUsers] = useState([]);
    const [insertUsers, setInsertUsers] = useState(false);

    const getUsers = async() => {
      const response = await postQuery({
          query: `query get_users {
              user{
                username
                email
                phone
                allowed_roles
                default_role
              }
            }`
      },
      token);
      setUsers(response?.user || []);
    }

  useEffect(() => {
    getUsers();
  }, [])

    return (
        <>
            <h3 style={{margin: "25px 0px 0px"}}>Usuarios</h3>
            {
              canWrite ? <button onClick={ () => { setInsertUsers(!insertUsers)} } type="button">Add</button> : ''
            }
            {
                insertUsers ? <InsertModalUsers insertUsers={insertUsers} setInsertUsers={setInsertUsers} getUsers={getUsers}/> : ''
            }
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Allowed Roles</th>
                  <th>Default Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.username}</td>
                      <td>{val.email}</td>
                      <td>{val.phone}</td>
                      <td>{val.allowed_roles}</td>
                      <td>{val.default_role}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </>
    )
}
