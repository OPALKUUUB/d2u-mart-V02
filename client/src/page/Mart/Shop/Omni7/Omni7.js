import { useEffect, useRef, useState } from "react";
import BackButt from "../../../../component/button/BackButt";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCard from "../../../../component/SubCard/ProductCard";
import Loading from "../../../../component/Loading/Loading";

const Omni7 = ({ children }) => {
  const [allItemData, setAllItemData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [pos, setPos] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef();

  useEffect(() => {
    setLoading(true);
    Firebase.database()
      .ref("/omni7")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          let data = [];
          setAmount(Object.keys(result).length);
          Object.keys(result).forEach((id) => {
            let item = {
              id: id,
              name: result[id]?.name,
              category: result[id]?.category,
              price: result[id]?.price,
              expire_date: result[id]?.expire_date,
              image: result[id]?.image,
              description: result[id]?.description,
              channel: "omni7",
            };
            data.push(item);
          });
          setAllItemData(data);
          let temp = [];
          for (let i = 0; i < 20; i++) {
            if (i === data.length) {
              break;
            }
            temp.push(data[i]);
          }
          setItemData(temp);
          setLoading(false);
        } else {
          setAllItemData([]);
        }
      });
    return () => {
      Firebase.database().ref("/omni7").off();
    };
  }, []);

  const handleNext = () => {
    let data_len = allItemData.length;
    if (pos + 20 < data_len) {
      let first = pos + 20;
      setPos(first);
      let count = 0;
      let temp = [];
      for (let i = first; i < data_len; i++) {
        if (count === 20) {
          break;
        } else {
          temp.push(allItemData[i]);
          count++;
        }
      }
      setItemData(temp);
    }
  };

  const handlePrev = () => {
    if (pos - 20 >= 0) {
      let first = pos - 20;
      setPos(first);
      let count = 0;
      let temp = [];
      for (let i = first; i < allItemData.length; i++) {
        if (count === 20) {
          break;
        } else {
          temp.push(allItemData[i]);
          count++;
        }
      }
      setItemData(temp);
    }
  };

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: sectionRef.current.offsetTop - 120,
    });
  });

  return (
    <section style={{ fontFamily: '"Prompt", sans-serif' }}>
      <Loading show={loading} />
      <BackButt link="/mart/shop" />
      <img
        src="/image/7-eleven.png"
        className="w-full object-cover object-center"
        alt=""
      />
      <div className="w-full bg-[#ece7e2] py-[50px]" ref={sectionRef}>
        <div className="w-[100%] md:w-[95%] mx-auto ">
          <div className="ml-[10px] mb-2">
            <Header />
          </div>
          <div className="flex justify-center flex-wrap gap-4 mb-3">
            {itemData.map((item, index) => (
              <ProductCard
                key={["ProductCard", item.id].join("_")}
                name={item?.name || "no name"}
                data={item}
              />
            ))}
          </div>
          <div className="flex justify-center items-center gap-4">
            <div
              className={`py-2 px-3 shadow-md text-gray-600 bg-amber-100 rounded-xl  ${
                pos - 20 < 0
                  ? "cursor-auto bg-dark text-white"
                  : "cursor-pointer"
              }`}
              onClick={handlePrev}
            >
              Prev
            </div>
            <div>
              {Math.ceil((pos + 1) / 20)}/{Math.ceil(amount / 20)}
            </div>
            <div
              className={`py-2 px-3 shadow-md text-gray-600 bg-amber-100 rounded-xl  ${
                pos + 20 > allItemData.length
                  ? "cursor-auto bg-dark text-white"
                  : "cursor-pointer"
              }`}
              onClick={handleNext}
            >
              Next
            </div>
          </div>
        </div>
      </div>
      <Basket />
    </section>
  );
};

const Header = () => {
  return (
    <div className="flex justify-center items-end gap-2 mb-10">
      <p className="m-0 md:text-[40px] text-[30px]">สินค้า</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">ทั้งหมด</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">
        (7-Eleven)
      </p>
    </div>
  );
};

export default Omni7;
