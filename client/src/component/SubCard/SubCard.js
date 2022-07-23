import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { basketState } from "../../AppStateManagement/ShopAtom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import "./SubCard.css";

const SubCard = (props) => {
  const navigate = useNavigate();
  const [itemInBasket, setItemInBasket] = useRecoilState(basketState);
  return (
    <div
      className="SubCard-container"
      style={{ fontFamily: '"Prompt", sans-serif' }}
    >
      <div className="SubCard-card">
        <div className="SubCard-imgBx">
          <img
            className="w-[70px] object-cover object-center rounded-lg"
            alt=""
            src={
              props.image_url !== undefined
                ? props.image_url
                : "https://www.daisonet.com/images/common/header/logo_pc.jpg"
            }
          />
        </div>
        <div className="SubCard-contentBx">
          <h2 className="text-[0.7rem]">{props.text}</h2>
          <p className="mb-0 text-[0.6rem] font-semibold">{props.price}</p>
          <p className="mb-0 text-[0.3rem]">Exp: {props?.expire_date || "-"}</p>
          <p className="mb-0 text-[0.3rem]">include tax</p>

          <div
            className="flex"
            onClick={() => {
              if (props.link !== undefined) {
                navigate(props.link);
              } else {
                if (
                  itemInBasket.findIndex(
                    (itemInBasket) => itemInBasket?.id === props?.item.id
                  ) !== -1
                ) {
                  setItemInBasket(
                    itemInBasket.map((itemInBasket) => {
                      if (itemInBasket?.id === props?.item.id) {
                        return {
                          ...itemInBasket,
                          count: itemInBasket.count + 1,
                        };
                      } else {
                        return itemInBasket;
                      }
                    })
                  );
                } else {
                  let itemToBasket = {
                    ...props.item,
                    count: 1,
                  };
                  setItemInBasket([...itemInBasket, itemToBasket]);
                }
              }
            }}
          >
            {props.link === undefined && <AddShoppingCartIcon />}
            {props.link === undefined ? "เพิ่มลงตะกร้า" : "ซื้อเลย"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCard;
