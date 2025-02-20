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

const Judge = () => {

    const judgeCollection = collection(db, 'judge');
    const votedProjectCollection = collection(db, 'VotedProject');

    const [Email, setEmail] = useState('');
    const [Comment, setComment] = useState('');
    const [FoundEmail, setFoundEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [JudgeFound, setJudgeFound] = useState({});
    const [ProjectFound, setProjectFound] = useState(false);
    const [SelectedProject, setSelectedProject] = useState({});

    const [Score, setScore] = useState({
        novelty: 1,
        usefulness: 1,
        feasibility: 1,
        technicalProficiency: 1,
        impact: 1,
        safety: 1
    })

    useEffect(() => {

    })

    const handleChange = e => {
        const { name, value } = e.target;

        if (Number(value) === 0 || Number(value) > 5) {
            console.log(name, value);
            alert('You only allowed to rate from 1 to 5')
            return;
        }
        setScore(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const addJudges = async () => {
        let count = 0;
        for (const student of Judges) {
            await addDoc(judgeCollection, student);
            count++;
        }
        alert("All Judges added into the system");
    };

    const searchJudge = async () => {
        const data = await getDocs(judgeCollection);
        const judgeListFound = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const judgeFound = judgeListFound.find(value => value.email.toLocaleLowerCase() === Email.toLocaleLowerCase());

        if (Email === "") {
            alert('Enter email address');
            return
        }
        setLoading(true);
        if (judgeFound) {
            setLoading(false);
            setJudgeFound(judgeFound)
        }
        else {
            setLoading(false);
            alert('This email is not allowed to cast vote');
        }
    }

    const getAllProjects = async () => {

    }

    function selectToVote(event) {
        console.log(event);
        setSelectedProject(Projects.filter(value => { return value.projectId === event })[0])
        setProjectFound(true)
        // console.log(Projects.filter(value => { return value.projectId === event })[0]);

    }

    async function submitvote() {
        var data = {
            novelty: Score.novelty,
            usefulness: Score.usefulness,
            feasibility: Score.feasibility,
            technicalProficiency: Score.technicalProficiency,
            impact: Score.impact,
            safety: Score.safety,
            comment: Comment,
            email: Email,
            project: SelectedProject.projectId,
            date: new Date().toString()
        }
        
        const response = await addDoc(votedProjectCollection, data)
        if(response.id){
            alert('Successfully to voted');
            
        }
        else{
            alert('Unable to vote')
        }
        

        // const response = await addDoc(voteCastedCollection, element);
    }

    return (
        <div style={{ paddingBottom: '50px' }}>
            <ToastContainer />
            {loading && <Loader />}
            <div className='container'>
                <h2>Enter your email</h2>
                <input
                    type="text"
                    className='form-control'
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email Address"
                    disabled={FoundEmail}
                />
                <button type="button" disabled={FoundEmail} className='btn btn-primary' style={{ marginTop: '10px' }} onClick={searchJudge}>Submit</button>

                {/* {JudgeFound ? <> */}
                <select className='form-select' onChange={(event) => selectToVote(event.target.value)}>
                    <option className='control-form' value={'#'}>---Select Project---</option>
                    {Projects.map((project, xid) => (
                        <option key={xid} value={project.projectId}>{project.name}</option>
                    ))}

                </select>
                {ProjectFound ?
                    <div>
                        <div className='project-details'>
                            <h4>{SelectedProject.name}</h4>
                            <img src={SelectedProject.image} alt={SelectedProject.name} className='project-details-image' />
                        </div>
                        <table id='student_table' style={{ marginTop: '20px' }}>
                            <thead>
                                <th style={{ width: '80%', marginTop: '20px' }}>Category</th>
                                <th>Score(1-5)</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Novelty</td>
                                    <td><input type='tel' maxLength={1} name="novelty" onChange={handleChange} value={Score.novelty} /></td>
                                </tr>
                                <tr>
                                    <td>Usefulness</td>
                                    <td><input type='tel' maxLength={1} name="usefulness" onChange={handleChange} value={Score.usefulness} /></td>
                                </tr>
                                <tr>
                                    <td>Feasibility</td>
                                    <td><input type='tel' maxLength={1} name="feasibility" onChange={handleChange} value={Score.feasibility} /></td>
                                </tr>
                                <tr>
                                    <td>Technical Proficiency</td>
                                    <td><input type='tel' maxLength={1} name="technicalProficiency" onChange={handleChange} value={Score.technicalProficiency} /></td>
                                </tr>
                                <tr>
                                    <td>Impact</td>
                                    <td><input type='tel' maxLength={1} name="impact" onChange={handleChange} value={Score.impact} /></td>
                                </tr>
                                <tr>
                                    <td>Safety</td>
                                    <td><input type='tel' maxLength={1} name="safety" onChange={handleChange} value={Score.safety} /></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='comment-section'>
                            <label>Comment</label>
                            <textarea rows={2} className='form-control' onChange={(event) => setComment(event.target.value)}></textarea>
                        </div>

                        <Button style={{ width: '100%' }} onClick={submitvote}>Submit Vote</Button>
                    </div>

                    :
                    <></>}

            </div>
        </div>
    )
}

export default Judge;