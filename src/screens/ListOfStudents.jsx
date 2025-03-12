import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { Categories } from '../data/categories';
import { Nominies } from '../data/nominies';
import { Students } from '../data/students';
import { Button } from 'react-bootstrap';
import { db } from '../config/firebase';
import { addDoc, getDocs, collection, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import Loader from '../components/Loader';
import LoaderIcon from "react-loader-icon";
import { ToastContainer, toast } from 'react-toastify';


const ListOfStudents = () => {

    const votersCollection = collection(db, 'Voters');
    const [ListOfStudents, setListOfStudents] = useState([]);
    const [modalShow, setModalShow] = React.useState(false);

    const [name, setName] = useState('');
    const [studentNo, setStudentNo] = useState('');
    const [semesterCode, setSemesterCode] = useState('');
    useEffect(() => {
        getAllStudent();

    }, [])

    const getAllStudent = async () => {
        const data = await getDocs(votersCollection);
        const studentListFound = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log(studentListFound);
        setListOfStudents(studentListFound);
    }

    const delete_student = async (student) => {
        const userDoc = doc(db, 'Voters', student.id);
        console.log(userDoc);

        // Update the user's "voted" status to true
        await deleteDoc(userDoc, { voted: 'true' });
        alert(student.name + ' with student number ' + student.studentNo + ' deleted successfully')
    }

    const add_new_students = async () => {
        var student={name, studentNo, semesterCode:'S0', voted: 'false'}
        await addDoc(votersCollection, student);
        alert(name+' has uploaded successfully')
    }

    let deatil_modal = <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Student Form
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name:</label>
                <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div className="mb-3">
                <label htmlFor="studentNumber" className="form-label">Student Number:</label>
                <input
                    type="text"
                    id="studentNumber"
                    className="form-control"
                    value={studentNo}
                    onChange={(e) => setStudentNo(e.target.value)}
                    required
                />
            </div>

            <div>
                <select
                    id="semester"
                    className="form-select"
                    onChange={(event) => setSemesterCode(event.target.value)}
                    required
                >
                    <option value="" disabled selected>Select Semester</option>
                    <option value="S1">Semester 1</option>
                    <option value="S2">Semester 2</option>
                </select>
            </div>

            <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '20px' }} onClick={add_new_students}>Submit</button>

        </Modal.Body>
    </Modal>
    return (<>
        <Button variant='primary' onClick={() => setModalShow(true)} >Add New Students</Button>
        {deatil_modal}
        <table id='student_table'>
            <thead>
                <th>Student Number</th>
                <th>Student Name</th>
                <th>Voted</th>
                <th>Action</th>
            </thead>
            <tbody>
                {ListOfStudents.map((student, xid) => (
                    <tr className='student' key={xid}>
                        <td>{student.studentNo}</td>
                        <td>{student.name}</td>
                        <td>{student.voted}</td>
                        <td><Button variant='success'>Edit</Button> <Button variant='danger' onClick={() => delete_student(student)}>Delete</Button> </td>
                    </tr>
                ))}
            </tbody>
        </table>

    </>)
}
export default ListOfStudents;