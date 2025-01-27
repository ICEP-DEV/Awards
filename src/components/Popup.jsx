import '../styles/popup.css';
import { MdCancel } from "react-icons/md";
function Pop_Up(props) {
    return (props.trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <div className="popup-inner-header">
                    <span onClick={() => props.setTrigger(false)} style={{textAlign:'right'}}><MdCancel /></span>
                </div>
                <div className="popup-inner-body">
                    {props.children}
                </div>

            </div>
        </div>
    ) : "";
}

export default Pop_Up;