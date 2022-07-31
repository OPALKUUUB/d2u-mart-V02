import { useEffect, useRef, useState } from "react";
import BackButt from "../../../../component/button/BackButt";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCard from "../../../../component/SubCard/ProductCard";

const Omni7 = ({ children }) => {
  const [allItemData, setAllItemData] = useState([]);
  const sectionRef = useRef();

  useEffect(() => {
    Firebase.database()
      .ref("/omni7")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          let data = [];
          Object.keys(result).forEach((id) => {
            let item = {
              id: id,
              name: result[id]?.name,
              category: result[id]?.category,
              price: result[id]?.price,
              expire_date: result[id]?.expire_date,
              image: result[id]?.image,
              description: result[id]?.description,
            };
            data.push(item);
          });
          setAllItemData(data);
          let indexList = [];
          for (let i = 0; i < Math.ceil(data.length / 18); i++) {
            indexList.push(i + 1);
          }
        } else {
          setAllItemData([]);
        }
      });
    return () => {
      Firebase.database().ref("/omni7").off();
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: sectionRef.current.offsetTop - 120,
    });
  });

  return (
    <section style={{ fontFamily: '"Prompt", sans-serif' }}>
      <BackButt link="/mart/shop" />
      <img src="/image/daisoCover.png" alt="" className="shadow-sm" />
      <div className="w-full bg-[#ece7e2] py-[50px]" ref={sectionRef}>
        <div className="w-[90%] mx-auto ">
          <div className="ml-[10px] mb-2">
            <Header />
          </div>
          <div className="flex justify-center flex-wrap gap-4">
            {allItemData.map((item, index) => (
              <ProductCard
                key={"subcard" + index}
                name={item?.name || "no name"}
                data={item}
              />
            ))}
          </div>
        </div>
      </div>
      <Basket />
    </section>
  );
};

const Header = () => {
  return (
    <div className="flex justify-start items-end gap-2 ">
      <p className="m-0 text-[50px]">สินค้า</p>
      <p className="m-0 text-[49px] text-[#f0a28e]">ทั้งหมด</p>
      <p className="m-0 text-[49px] text-[#f0a28e]">(Omni7)</p>
    </div>
  );
};

export default Omni7;
