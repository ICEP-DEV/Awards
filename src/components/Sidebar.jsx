import { Link } from "react-router-dom";
import '../styles/sidebar.css'
import { BsSpeedometer, BsPersonCircle, BsPeopleFill, BsPeople, BsBookFill } from "react-icons/bs";
import logo from '../assets/ICEPLOGO.jpg'
function Sidebar() {

    return (<div id="sidebar">
        <div id="sidebar-head">
            <img src={logo} alt="icep logo" width="50px" height="50px" style={{ borderRadius: "100%" }} />
            <h4 style={{ marginTop: "15px", marginLeft: "15px" }}>ICEP</h4>
        </div>
        <div id="sidebar-content">
            <div className="side-content">
                <span className="side-icon"> <BsSpeedometer size={25} /></span>
                <span className="side-label"><Link to='/'><h5>Dashborad</h5></Link></span>
            </div>
            <div className="side-content">
                <span className="side-icon"> <BsBookFill size={25} /></span>
                <span className="side-label"><Link to='/applicants'><h5>Applications</h5></Link></span>
            </div>
            <div className="side-content">
                <span className="side-icon"> <BsPeopleFill size={25} /></span>
                <span className="side-label"><Link to='/team'><h5>Team</h5></Link></span>
            </div>
            <div className="side-content">
                <span className="side-icon"> <BsPeople size={25} /></span>
                <span className="side-label"><Link to='/students'><h5>Students</h5></Link></span>
            </div>
            <div className="side-content">
                <span className="side-icon"> <BsPersonCircle size={25} /></span>
                <span className="side-label"><Link to='/profile'><h5>Profile</h5></Link></span>
            </div>
        </div>
    </div>)


}

export default Sidebar;