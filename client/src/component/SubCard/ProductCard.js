import React, { useRef, useState, useEffect } from "react";
import "./ProductCard.css";
import { useRecoilState } from "recoil";
import { basketState } from "../../AppStateManagement/ShopAtom";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

function useHover() {
  const [value, setValue] = useState(false);
  const ref = useRef(null);
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (node) {
        node.addEventListener("mouseover", handleMouseOver);
        node.addEventListener("mouseout", handleMouseOut);
        return () => {
          node.removeEventListener("mouseover", handleMouseOver);
          node.removeEventListener("mouseout", handleMouseOut);
        };
      }
    },
    [ref.current] // Recall only if ref changes
  );
  return [ref, value];
}

const ProductCard = (props) => {
  const [itemInBasket, setItemInBasket] = useRecoilState(basketState);
  const heightCardRef = useRef();
  const [hoverRef, isHovered] = useHover();
  console.log(heightCardRef);

  const handleClickAddProduct = () => {
    const checkIsInBasket =
      itemInBasket.findIndex(
        (itemInBasket) => itemInBasket?.id === props?.data.id
      ) !== -1;
    if (checkIsInBasket) {
      setItemInBasket(
        itemInBasket.map((itemInBasket) => {
          if (itemInBasket?.id === props?.data.id) {
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
        ...props.data,
        count: 1,
      };
      setItemInBasket([...itemInBasket, itemToBasket]);
    }
  };
  console.log(props.data);
  return (
    <>
      <div className="w-[300px] h-[320px] rounded-[1.5rem] bg-[#ffffff] shadow-sm overflow-hidden relative cursor-pointer">
        <div className="relative w-[220px] m-auto mt-3">
          <img
            className="absolute top-0 left-0 rounded-lg"
            src={props.data.image}
            alt=""
          />
        </div>
        <div className="absolute bottom-0">
          <div
            ref={hoverRef}
            id="curved-corner-bottomright"
            className="product_box_content"
            // className={`h-fit max-h-[55px] hover:h-[200px] duration-150 ease-out w-[200px] bg-white text-[.6rem] rounded-tl-[1.5rem] relative px-3 pt-2`}
          >
            <div
              id="product_name"
              className="text-[0.9rem] font-medium w-full overflow-hidden mb-2"
            >
              {isHovered
                ? props.data.name
                : props.data.name.slice(0, 30) +
                  `${props.data.name.length > 20 ? "..." : ""}`}
            </div>
            <div
              id="product_price"
              className="text-[0.9rem] font-semibold mb-2"
            >
              ¥ {props.data?.price}{" "}
              <span className="text-[1px] xl:text-[10px] font-normal">
                (tax included)
              </span>
            </div>

            <div className="font-medium">รายละเอียด</div>
            <div className="ml-2 mb-1">
              {props.data.description === ""
                ? `- no data`
                : `- ${props.data.description}`}
            </div>
            <div className="mb-1">
              <span className="font-medium">วันหมดอายุ:</span>{" "}
              {props.data?.expire_date?.length > 0
                ? props.data.expire_date
                : "no data"}
            </div>
            <div className="flex flex-wrap gap-1 pb-2">
              <div className="text-white bg-gray-400 rounded-lg px-2 ">
                tag:
              </div>
              {props.data.category?.map((item, index) => (
                <div
                  key={["ProductCard-item", item.id, index].join("_")}
                  className="text-white bg-pink-400 rounded-lg px-2 "
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          className="absolute bottom-1 right-5"
          onClick={handleClickAddProduct}
        >
          <AddShoppingCartIcon />
        </button>
      </div>
    </>
  );
};

export default ProductCard;
