import {Machines} from '../components/Machines/Machines';
import { MachineTypes } from '../components/MachineTypes/MachineTypes';
import { Record } from '../components/Record/Record';
import { Maintenances } from '../components/Maintenances/Maintenances';

export const FirstApp = () => {


    return (
    <>
        <h1>Machine Managment System</h1>
        <Machines />
        <MachineTypes />
        <Record />
        <Maintenances />
    </>
    )
}