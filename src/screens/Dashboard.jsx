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
import { ToastContainer, toast } from 'react-toastify';

const VotingContent = () => {
  const [studentNo, setStudentNo] = useState('');
  const [studentDetails, setstudentDetails] = useState({});
  const [votedResults, setVotedResults] = useState([]);
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
    console.log(getInformation());
  }, []);

  const addStudents = async () => {
    let count = 0;
    for (const student of Students) {
      await addDoc(votersCollection, student);
      count++;
    }
    alert("All students added into the system");
  };

  const deleteStudent = async () =>{
    
  }


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
          //element.voter = studentDetails.studentNo;
          //  element.dateVoted = new Date();
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
    const studentListFound = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    const studentFound = studentListFound.find(value => value.studentNo === studentNo);
    if (studentFound) {
      console.log(studentFound);
      
      setLoading(true);
      setVerifiedStudentDetails(studentFound);
      if (studentFound.semesterCode === "S0") {
        setTimeout(() => {
          setFoundStudentNo(true);
          setLoading(false)
          getInformation();
        }, 3000);
      } else {
        if (studentFound.voted === 'true') {
          setLoading(false);
          toast('This student number has already voted', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
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

  async function getInformation() {
    var categorizedData = [];
    var nomenie_results = {};
    const data = await getDocs(voteCastedCollection);
    const results = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    console.log(Categories);

    Nominies.forEach(nominie => {
      if (categorizedData.filter(value => { return value.student === nominie.student && value.category === nominie.categoryId }).length === 0) {
        nomenie_results = {
          name: nominie.name,
          student: nominie.student,
          category: nominie.categoryId,
          categoryname: Categories.filter(value => { return value.categoryId === nominie.categoryId })[0],
          score: results.filter(value => { return value.student === nominie.student && value.categoryId == nominie.categoryId }).length
        }
        categorizedData.push(nomenie_results)
      }
    });
    setVotedResults(categorizedData.sort((a, b) => b.score - a.score));
    console.log(categorizedData);


  }

  let winners = <div className='stats_table'>
    <h3>Winners</h3>
    <table id='student_table'>
      <thead>
        <th>Categories</th>
        <th>Winner</th>
        <th>ID</th>
        <th>Points</th>
      </thead>
      <tbody>
        {Categories.map((cat, xid) => {
          // Filter the votedResults by categoryId
          const filteredResults = votedResults.filter(value => value.category === cat.categoryId);

          // Sort filtered results by score in descending order and get the highest score
          const highestScoreResult = filteredResults.length > 0
            ? filteredResults.sort((a, b) => b.score - a.score)[0] // Sort and take the first (highest) score
            : null;

          return (
            <tr key={xid}>
              <td>{cat.categoryName}</td>
              <td>{highestScoreResult ? highestScoreResult.name : 'No result'}</td> {/* Display name of the highest score */}
              <td>{highestScoreResult ? highestScoreResult.student : 'N/A'}</td> {/* Display highest score */}
              <td>{highestScoreResult ? highestScoreResult.score : 'N/A'}</td> {/* Display highest score */}

            </tr>
          );
        })}


      </tbody>
    </table>

    <div className='results'>
      <h3>Scores per categories</h3>

      {Categories.map((cat, xid) => (
        <div key={xid} className='result_per_voters'>
          <h5>{cat.categoryName}</h5>
          <table id='student_table'>
            <thead>
              <th>name</th>
              <th>ID</th>
              <th>Points</th>
            </thead>
            <tbody>
              {votedResults.filter(value => { return value.category === cat.categoryId }).map((result, zid) => (
                <tr key={zid}>
                  <td>{result.name}</td>
                  <td>{result.student}</td>
                  <td>{result.score}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  </div>

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
      <ToastContainer />
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
        <button type="button" disabled={foundStudentNo} className='btn btn-primary' style={{ marginTop: '10px' }} onClick={searchStudent}>Submit</button>
        {verifiedStudentDetails.semesterCode === "S0" ?
          <div className=''>
            {winners}
          </div>
          :
          <div className='content'>
            {foundStudentNo ? <>
              <div className='voter_details'>
                <h5><label className='bold_voter_details'><b>Name</b> </label><span>: {verifiedStudentDetails.name}</span></h5>
                <h5><label className='bold_voter_details'><b>Student Number</b> </label><span>: {verifiedStudentDetails.studentNo}</span></h5>
              </div>
              {Categories.map((category, xid) => (
                <div className='category' key={category.categoryId}>
                  <h4 className='category-key'>{xid + 1} {category.categoryName}</h4>
                  {Nominies.filter(value => { return value.student === studentNo && value.categoryId === category.categoryId }).length > 0 ?
                    <>
                      <h3 style={{ textAlign: 'center', backgroundColor: 'lightblue' }}>You are nominated to this category</h3>
                    </>
                    : <div className='nominations'>
                      {Nominies.filter(nominie => nominie.categoryId === category.categoryId).map((nominie) => (
                        <div key={nominie.student} className='nominie'>
                          <label className='view-more' onClick={() => { setModalShow(true); setstudentDetails(nominie) }}>View</label>
                          <img src={nominie.image} alt={nominie.name} className='nominie-image fluid m2' />
                          <h5 className='nominie-name'>{nominie.name}</h5>
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

                            <label className='btn btn-secondary btn-block vote-btn' >Selected</label>
                          ) : (
                            <label
                              htmlFor={`${nominie.categoryId}-${nominie.student}`}
                              className='btn btn-primary btn-block vote-btn'
                            >
                              Vote
                            </label>
                          )

                          }
                          {deatil_modal}
                        </div>

                      ))}
                    </div>}

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
