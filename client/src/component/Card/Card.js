import { useNavigate } from "react-router-dom";
import "./Card.css";

const Card = (Name) => {
    const navigate = useNavigate()
    return (
        <div className="container">
            <div className="card">
                <h2>{Name.text}</h2>
                <i className="fas fa-arrow-right"></i>
                <p>แสดงทั้งหมด</p>
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
                <button onClick={()=>navigate(Name.link)}>
                </button>
            </div>
        </div>
    );
};

export default Card;