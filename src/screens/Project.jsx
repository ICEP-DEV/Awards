import React, { useEffect, useState } from 'react';
import '../styles/judge.css';
import { Categories } from '../data/categories';
import { Projects } from '../data/projects';
import { Judges } from '../data/judge';
import { Button } from 'react-bootstrap';
import { db } from '../config/firebase';
import { addDoc, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import Loader from '../components/Loader';
import LoaderIcon from "react-loader-icon";
import { ToastContainer, toast } from 'react-toastify';

const Project = () => {
    const votedProjectCollection = collection(db, 'VotedProject');

    const [AllProjects, setAllProjects] = useState([]);

    useEffect(() => {
        getProjectData();
    }, [])

    async function getProjectData() {
        var categorizedProjectData = [];
        var project_results = {};
        const data = await getDocs(votedProjectCollection);
        const results = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log(results);
        console.log(Projects);
        Projects.forEach(project => {
            if (categorizedProjectData.filter(value => { return value.project === project.projectId }).length === 0) {
                var total = 0;
                var numberOfJudges = 0;
                for (var k = 0; k < results.length; k++) {

                    if (results[k].project === project.projectId) {
                        total = total + results[k].totalScore;
                        numberOfJudges++;
                    }

                }
                console.log('number of judges'+ project.name +numberOfJudges);
                
                project_results = {
                    name: project.name,
                    semester: project.semester,
                    projectId: project.projectId,
                    score: total/numberOfJudges
                }
                console.log(project_results);

                categorizedProjectData.push(project_results)
            }
        });
        console.log(categorizedProjectData);
        setAllProjects(categorizedProjectData);

    }

    return (
        <div>
            <div className='stats_table'>

                <h3>Winners </h3>
                <table id='student_table'>
                    <thead>
                        <th>Winner</th>
                        <th>Semester</th>
                        <th>Points</th>
                    </thead>
                    <tbody>
                        {AllProjects.map((project, xid) => (
                            <tr key={xid}>
                                <td>{project.name}</td>
                                <td>{project.semester}</td>
                                <td>{project.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default Project;