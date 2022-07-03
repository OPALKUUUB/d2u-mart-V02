import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BackButt.css";

const BackButt = (Name) => {
    const navigate = useNavigate();
    const [isButtonMoveUp , setIsButtonMoveUp ] = useState(false)
    useEffect(()=>{
        window.addEventListener('scroll',()=>{
            if(window.scrollY > 250){
                setIsButtonMoveUp(true);
            }else setIsButtonMoveUp(false);
        })
        return ()=>{
            window.removeEventListener('scroll',()=>{
                if(window.scrollY > 250){
                    setIsButtonMoveUp(true);
                }else setIsButtonMoveUp(false);
            })
        }
    },[])
    return (
        <button type="button" className={`backButt ${isButtonMoveUp ? 'mt-[20px]' : 'mt-[175px]' } ease-linear duration-200`} onClick={()=>navigate(Name.link)}>
            <span>กลับ </span>
        </button>
    );
};

export default BackButt;