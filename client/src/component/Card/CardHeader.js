import { useNavigate } from "react-router-dom";
import "./CardHeader.css";

const CardHeader = (Name) => {
    return (
        <div className="container">
            <div className="card">
                <h2>{Name.text}</h2>
                <i className="fas fa-arrow-down"></i>
                <p>ร้านค้าทั้งหมด</p>
                <div className="pic"></div>
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <button>
                </button>
            </div>
        </div>
    );
};

export default CardHeader;