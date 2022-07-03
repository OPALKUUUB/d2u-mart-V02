import { useNavigate } from "react-router-dom";
import "./SubCard.css";

const SubCard = (props) => {
    const navigate = useNavigate()
    return (
        <div className="SubCard-container">
            <div className="SubCard-card">
                <div className="SubCard-imgBx">
                    <img className="w-[180px] h-[180px] object-cover object-center rounded-lg" alt="" src={props.image_url !== undefined ? props.image_url :'https://www.daisonet.com/images/common/header/logo_pc.jpg'}/>
                </div>
                <div className="SubCard-contentBx">
                    <h2 className="text-[18px]">{props.text}</h2>
                    <p className="mb-0 text-[22px] font-semibold py-[2px]">{props.price}</p>
                    <a onClick={()=>navigate(props.link)}>ซื้อเลย</a>
                </div>
            </div>
        </div>
    );
};

export default SubCard;