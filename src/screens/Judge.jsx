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
import { useNavigate } from 'react-router-dom';

const Judge = () => {
    const navigate = useNavigate();
    const judgeCollection = collection(db, 'judge');
    const votedProjectCollection = collection(db, 'VotedProject');

    let [Email, setEmail] = useState('');
    const [Comment, setComment] = useState('');
    const [FoundEmail, setFoundEmail] = useState(false);
    const [loading, setLoading] = useState(false);
    const [VotedProject, setVotedProject] = useState([]);
    const [AllProjects, setAllProjects] = useState([]);
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
        var user_id = localStorage.getItem('user_id') || "";
        if (user_id !== "") {
            setFoundEmail(true);
            setEmail("admin@gmail.com");
            getAllProjects();
        }
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
        setTimeout(() => {
            if (judgeFound) {
                localStorage.setItem('user_id', Email.toString());
                setLoading(false);
                setJudgeFound(judgeFound);
                setFoundEmail(true);
                getAllProjects();
            }
            else {
                setLoading(false);
                alert('This email is not allowed to cast vote');
            }
        }, 3000);
    }

    const clearEmail = () => {
        setEmail('')
        localStorage.removeItem('user_id')
        setFoundEmail(false);
    }

    const getAllProjects = async () => {
        //Email
        const data = await getDocs(votedProjectCollection);
        const results = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log(results.filter(value => { return value.email.toLocaleLowerCase() === Email.toLocaleLowerCase() }));

        setVotedProject(results.filter(value => { return value.email.toLocaleLowerCase() === Email.toLocaleLowerCase() }));

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
        setLoading(true);

        const response = await addDoc(votedProjectCollection, data)
        setTimeout(() => {
            if (response.id) {
                alert('Successfully to voted');
                navigate(0)

            }
            else {
                alert('Unable to vote')
            }
            setLoading(false);
        }, 3000);

        // const response = await addDoc(voteCastedCollection, element);
    }

    return (
        <div style={{ paddingBottom: '50px' }}>
            <ToastContainer />
            {loading && <Loader />}
            <div className='container'>
                <h2>Enter your email</h2>
                <input
                    value={Email}
                    type="text"
                    className='form-control'
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email Address"
                    disabled={FoundEmail}
                />
                <button type="button" disabled={FoundEmail} className='btn btn-primary' style={{ marginTop: '10px' }} onClick={searchJudge}>Submit</button>
                <button type="button" disabled={!FoundEmail} className='btn btn-danger' style={{ marginTop: '10px' }} onClick={clearEmail}>Cancel</button>

                {FoundEmail ? <>
                    <select className='form-select' onChange={(event) => selectToVote(event.target.value)}>
                        <option className='control-form' value={'#'}>---Select Project---</option>
                        {Projects.filter(project =>
                            !VotedProject.some(voted => voted.project === project.projectId)
                        ).map((project, xid) => (
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
                </> : <></>}
            </div>
        </div>
    )
}

export default Judge;