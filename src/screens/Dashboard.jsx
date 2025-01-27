import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css';
import { Categories } from '../data/categories';
import { Nominies } from '../data/nominies';
import { Students } from '../data/students';
import { Button } from 'react-bootstrap';
import { db } from '../config/firebase';
import { addDoc, getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import Modal from 'react-bootstrap/Modal';
import Loader from '../components/Loader';
import LoaderIcon from "react-loader-icon";
const VotingContent = () => {
  const [studentNo, setStudentNo] = useState('');
  const [studentDetails, setstudentDetails] = useState({});
  const [verifiedStudentDetails, setVerifiedStudentDetails] = useState({});
  const [foundStudentNo, setFoundStudentNo] = useState(false);
  const [selectedVote, setSelectedVote] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // collections of firebase
  const votersCollection = collection(db, 'Voters');
  const voteCastedCollection = collection(db, 'Voted');


  useEffect(() => {
    console.log(Students);
  }, []);

  const addStudents = async () => {
    let count = 0;
    for (const student of Students) {
      await addDoc(votersCollection, student);
      count++;
    }
    alert("All students added into the system");
  };

  const handleOptionChange = (categoryId, student) => {
    // Check if the vote for this category already exists
    const existingVoteIndex = selectedVote.findIndex(vote => vote.categoryId === categoryId);

    if (existingVoteIndex !== -1) {
      // Update existing vote
      const updatedVotes = [...selectedVote];
      updatedVotes[existingVoteIndex] = { categoryId, student };
      setSelectedVote(updatedVotes);
    } else {
      // Add new vote
      setSelectedVote([...selectedVote, { categoryId, student }]);
      console.log(selectedVote);

    }
  };

  const submitVotes = async () => {
    setLoading(true)
    let count = 0;
    const userDoc = doc(db, 'Voters', verifiedStudentDetails.id);

    // Update the user's "voted" status to true
    await updateDoc(userDoc, { voted: 'true' });

    // Use Promise.all to handle the array of promises and ensure all votes are submitted
    const votePromises = selectedVote.map(async (element) => {
      try {
        if (element) {
          const response = await addDoc(voteCastedCollection, element);
          count++;
          console.log(response);
        }

      } catch (error) {
        console.error("Error adding vote:", error);
      }
    });

    // Wait for all the promises to resolve
    await Promise.all(votePromises);

    // After all votes are submitted, show an alert with the total count

    setTimeout(() => {
      setIsSubmitted(true)
      setLoading(false)
      alert('Submitted ' + count + ' votes');
    }, 3000);


  };

  const searchStudent = async () => {
    //db.collection('Voters').doc(studentNo).update({voted:true})
    const data = await getDocs(votersCollection);
    setLoading(true)
    const studentListFound = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const studentFound = studentListFound.find(value => value.studentNo === studentNo);

    if (studentFound) {
      setVerifiedStudentDetails(studentFound);
      if (studentFound.semesterCode === "S0") {
        setTimeout(() => {
          setFoundStudentNo(true);
          setLoading(false)
          getInformation();
        }, 3000);
      } else {
        if (studentFound.voted === 'true') {
          alert('This student number has already voted');
        } else {
          //alert('Are you ready to vote')
          setTimeout(() => {
            setFoundStudentNo(true); // Allow voting
            setLoading(false)
          }, 3000);

        }
      }

    } else {
      setIsSubmitted(true)
      alert('This student number is not allowed to vote');
    }
  };

  function getInformation() {
    const categorizedData = [];
  }

  let deatil_modal = <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {studentDetails.name}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>{studentDetails.motivation} </p>
    </Modal.Body>
    <Modal.Footer>
      <Button onClick={() => setModalShow(false)}>Close</Button>
    </Modal.Footer>
  </Modal>
  return (
    <div style={{ paddingBottom: '50px' }}>
      {loading && <Loader />}

      <div className='container'>
        <h2>Enter your Student Number</h2>
        <input
          type="text"
          className='form-control'
          onChange={(event) => setStudentNo(event.target.value)}
          placeholder="Student Number"
          disabled={foundStudentNo}
        />
        <button type="button" disabled={foundStudentNo} className='btn btn-primary' onClick={searchStudent}>Submit</button>
        {verifiedStudentDetails.semesterCode === "S0" ?
          <div className=''>
            <table id='student_table'>
              <thead>
                <th>Categories</th>
                <th>Winner</th>
                <th>ID</th>
                <th>Points</th>
              </thead>
              <tbody>
                <tr>
                  <td>Scrum</td>
                  <td>Itu</td>
                  <td>12345</td>
                  <td>Points</td>
                </tr>

              </tbody>
            </table>
          </div>
          :
          <div className='content'>
            {foundStudentNo ? <>
              {Categories.map((category) => (
                <div className='category' key={category.categoryId}>
                  <h4>{category.categoryName}</h4>
                  <div className='nominations'>
                    {Nominies.filter(nominie => nominie.categoryId === category.categoryId).map((nominie) => (
                      <div key={nominie.student} className='nominie'>
                        <label className='view-more' onClick={() => { setModalShow(true); setstudentDetails(nominie) }}>View</label>
                        <img src={nominie.image} alt={nominie.name} className='nominie-image fluid m2' />
                        <input
                          type="radio"
                          id={`${nominie.categoryId}-${nominie.student}`}
                          name={nominie.categoryId}
                          value={nominie.student}
                          onChange={() => handleOptionChange(nominie.categoryId, nominie.student)}
                          hidden
                        />
                        {/* Display button based on selection */}
                        {selectedVote.some(vote => vote.student === nominie.student && vote.categoryId === nominie.categoryId) ? (
                          <label className='btn btn-secondary btn-block vote-btn'>Selected</label>
                        ) : (
                          <label
                            htmlFor={`${nominie.categoryId}-${nominie.student}`}
                            className='btn btn-primary btn-block vote-btn'
                          >
                            Vote
                          </label>
                        )}
                        {deatil_modal}
                      </div>

                    ))}
                  </div>
                </div>
              ))}
              <span style={{ display: 'flex', flexDirection: 'row' }}>
                <Button variant='success' onClick={submitVotes} disabled={isSubmitted}>Submit Votes  </Button>
                {isSubmitted && <LoaderIcon size={20} style={{ fontSize: '2em', fontWeight: 'bold' }} />}
              </span>

            </> : <></>}

          </div>
        }
      </div>



    </div>

  );
};

export default VotingContent;
