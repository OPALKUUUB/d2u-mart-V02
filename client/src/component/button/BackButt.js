import { useNavigate } from "react-router-dom";
import "./BackButt.css";

const BackButt = (Name) => {
    const navigate = useNavigate()
    return (
        <button type="button" className="backButt" onClick={()=>navigate(Name.link)}>
            <span>กลับ </span>
        </button>
    );
};

export default BackButt;