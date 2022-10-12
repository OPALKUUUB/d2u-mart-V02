import { useNavigate } from "react-router-dom";

const ShopCard = (props) => {
  const navigate = useNavigate();
  return (
    <div
      className="cursor-pointer bg-gray-200 px-3 py-2 rounded-lg shadow-sm w-[250px] flex flex-col justify-between gap-2"
      style={{ fontFamily: '"Prompt", sans-serif' }}
      onClick={() =>
        navigate(
          props.mode === "dev"
            ? alert("ปิดให้บริการแล้ว")
            : props.link + "?category=ทั้งหมด&page=1"
        )
      }
    >
      <img
        className="w-full"
        src={props?.image_url}
        alt={props?.alt || "shop image"}
      />
      <h4 className="text-center">{props.name}</h4>
    </div>
  );
};

export default ShopCard;
