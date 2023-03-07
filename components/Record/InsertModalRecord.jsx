import {useMemo, useState, useEffect} from 'react';
import {postQuery} from '../../helpers/postQueries';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('/');
}

const postRecord = async({id, date, status, machineId, manager_id, observation, maintenanceId}, token, defaultRole) => {
    const query = `mutation ctrlMaintenanceRec {
        insert_controlMaintenanceRecord(
            objects: [{${ id ? `id: ${id},` : ""}
            date: "${formatDate(date)}",
            status: "${status}", 
            machineId: "${machineId}",
            manager_id: "${manager_id}",
            maintenanceId: "${maintenanceId}",
            observation: "${observation}"}]) {
          affected_rows
        }
      }`
    const result = await postQuery({query}, token, defaultRole);
    return result;
}

Modal.setAppElement('#root');

export const InsertModalRecord = ({getRecord, token, insertRecord, setInsertRecord, defaultRole}) => {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ formSubmitted, setFormSubmitted ] = useState(false);
    const [machine, setMachine] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [managerIds, setManagerIds] = useState([]);

    const getMachines = async() => {
        const response = await postQuery({
            query: `query show_machine {
                machines(order_by: {id: asc}, where: {deleted: {_eq: false}}) {
                  id
                }
              }`
        }, 
        token,
        defaultRole);
        setMachine(response?.machines || []);
    }

    const getMaintenances = async() => {
        const response = await postQuery({
            query: `query show_maintenances {
                maintenances(order_by: {id: asc}, where: {deleted: {_eq: false}}) {
                  id
                  machineType
                  frequency
                  type
                  deleted
                }
              }`
        }, 
        token,
        defaultRole);
        setMaintenance(response?.maintenances || []);
    }

    const getManagerIds = async() => {
        const response = await postQuery({
            query: `query get_users {
                user(order_by: {id: asc}, where: {_and: {default_role: {_eq: "manager"}, deleted: {_eq: false}}}) {
                  id
                }
              }`
        },
        token,
        defaultRole);
        setManagerIds(response?.user || []);
    }

    useEffect(() => {
        getMachines();
        getMaintenances();
        getManagerIds();
    }, [])
    
    const [formValues, setFormValues] = useState({
        id: '',
        date: new Date(),
        status: '',
        machineId: '',
        manager_id: '',
        maintenanceId: '',
        observation: '',
    })

    const statusClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.status.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.status, formSubmitted ])

    const machineIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.machineId.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.machineId, formSubmitted ])

    const managerIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.manager_id.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.manager_id, formSubmitted ])

    const maintenanceIdClass = useMemo(() => {
        if (!formSubmitted) return '';

        return (formValues.maintenanceId.length > 0)
            ? 'is-valid'
            : 'is-invalid';

    }, [ formValues.maintenanceId, formSubmitted ])

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const onChangeDate = ( event, changing ) => {
        setFormValues({
            ...formValues,
            [changing]: event
        })
    }

    // const onOpenModal = () => {
    //     setIsOpen(true);
    //     getMachines(token);
    //     getMaintenances(token);
    // }

    const onCloseModal = () => {
        setInsertRecord(false);
        setFormValues({
            id: '',
            date: new Date(),
            status: '',
            machineId: '',
            manager_id: '',
            maintenanceId: '',
            observation: '',
        })
        setFormSubmitted(false);
    }

    const onSubmit = async event  => {
        event.preventDefault();

        const result = await postRecord(formValues, token, defaultRole);
        if(result && result.insert_controlMaintenanceRecord.affected_rows === 1){
            getRecord()
            onCloseModal();
        } else {
            Swal.fire('Insert error', 'Please check all fields are correct', 'error');
            setFormSubmitted(true);
        }
    }

    return (
        <>
            {/* <button onClick={ onOpenModal } type="button">Add</button> */}
            <Modal
                isOpen={insertRecord}
                onRequestClose={ onCloseModal }
                style={customStyles}
            >
                <h1> Insert Record </h1>
                <hr />
                <form className="container" onSubmit={ onSubmit }>

                    <div className="form-group mb-2">
                        <label>Id</label>
                        <input
                            className="form-control"
                            name = "id"
                            value = { formValues.id }
                            onChange={ onInputChanged }
                        />

                    </div>

                    <div className="form-group mb-2">
                        <label>Date</label>
                        <DatePicker
                            selected={ formValues.date}
                            onChange={ (event) => onChangeDate(event, 'date') }
                            className="form-control"
                        />
                    </div>

                    <div className="form-group mb-2">
                        <label>Status</label>
                        <select 
                            className={`form-control ${statusClass}`}
                            name = "status"
                            value={ formValues.status }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            <option value={"Done"}>Done</option>
                            <option value={"To do"}>To do</option>
                            <option value={"In progress"}>In progress</option>
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>MachineId</label>
                        <select 
                            className={`form-control ${machineIdClass}`}
                            name = "machineId"
                            value={ formValues.machineId }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                machine.map( machine => (
                                    <option key={machine.id} value={machine.id}>{machine.id}</option>
                                ))
                            }
                        </select>
                    </div>

                    {/* <div className="form-group mb-2">
                        <label>ManagerId</label>
                        <input
                            className={`form-control ${managerIdClass}`}
                            name = "managerId"
                            value = { formValues.managerId }
                            onChange={ onInputChanged }
                        />
                    </div> */}

                    <div className="form-group mb-2">
                        <label>ManagerId</label>
                        <select 
                            className={`form-control ${managerIdClass}`}
                            name = "manager_id"
                            value={ formValues.manager_id }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                managerIds.map( manager => (
                                    <option key={manager.id} value={manager.id}>{manager.id}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>MaintenanceId</label>
                        <select 
                            className={`form-control ${maintenanceIdClass}`}
                            name = "maintenanceId"
                            value={ formValues.maintenanceId }
                            onChange={onInputChanged}>
                            <option value={""}></option>
                            {
                                maintenance.map( maintenance => (
                                    <option key={maintenance.id} value={maintenance.id}>{maintenance.id}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group mb-2">
                        <label>Observation</label>
                        <input
                            className={`form-control`}
                            name = "observation"
                            value = { formValues.observation }
                            onChange={ onInputChanged }
                        />
                    </div>

                   <button
                        type="submit"
                        className="btn btn-outline-primary btn-block"
                    >
                        <i className="far fa-save"></i>
                        <span> Save </span>
                    </button>

                </form>
            </Modal>
        </>
    )
}
