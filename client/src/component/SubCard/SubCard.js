import { useNavigate } from "react-router-dom";
import "./SubCard.css";

const SubCard = (Name) => {
    const navigate = useNavigate()
    return (
        <div className="SubCard-container">
            <div className="SubCard-card">
                <div className="SubCard-imgBx">
                    <img alt="" src="https://www.daisonet.com/images/common/header/logo_pc.jpg"/>
                </div>
                <div className="SubCard-contentBx">
                    <h2>{Name.text}</h2>
                    <a onClick={()=>navigate(Name.link)}>ซื้อเลย</a>
                </div>
            </div>
        </div>
    );
};

export default SubCard;