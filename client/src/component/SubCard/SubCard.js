import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { basketState } from "../../AppStateManagement/ShopAtom";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import "./SubCard.css";

const SubCard = (props) => {
    const navigate = useNavigate();
    const [ itemInBasket , setItemInBasket ] = useRecoilState(basketState);
    return (
        <div className="SubCard-container" style={{fontFamily: '"Prompt", sans-serif'}}>
            <div className="SubCard-card">
                <div className="SubCard-imgBx">
                    <img className="w-[180px] h-[180px] object-cover object-center rounded-lg" alt="" src={props.image_url !== undefined ? props.image_url :'https://www.daisonet.com/images/common/header/logo_pc.jpg'}/>
                </div>
                <div className="SubCard-txt">
                    <h2 className="text-[14px]">{props.text}</h2>
                    <p className="mb-0 text-[15px] font-semibold py-[2px]">{props.price}</p>
                </div>
                <div className="SubCard-contentBx">
                    <div className="flex" onClick={()=>{
                        if(props.link !== undefined){
                            navigate(props.link);
                        }else{
                            if(itemInBasket.findIndex((itemInBasket)=>itemInBasket?.id === props?.item.id) !== -1){
                                setItemInBasket(itemInBasket.map((itemInBasket)=>{
                                    if(itemInBasket?.id === props?.item.id){
                                        return {
                                            ...itemInBasket,
                                            count:itemInBasket.count + 1,
                                        }
                                    }else{
                                        return itemInBasket
                                    }
                                }))
                            }else{
                                let itemToBasket = {
                                    ...props.item,
                                    count:1
                                };
                                setItemInBasket([...itemInBasket,itemToBasket])
                            }
                        }
                    }}>
                        {props.link === undefined &&
                        <AddShoppingCartIcon/>}
                        {props.link === undefined ? 'เพิ่มลงตะกร้า' : 'ซื้อเลย'}
                    </div>
                    <h3>exp.</h3>
                    <h3>tax</h3>
                </div>
            </div>
        </div>
    );
};

export default SubCard;