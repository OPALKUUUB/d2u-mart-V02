import { useEffect, useRef, useState } from "react";
import BackButt from "../../../../component/button/BackButt";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCard from "../../../../component/SubCard/ProductCard";
import Loading from "../../../../component/Loading/Loading";
import { useSearchParams } from "react-router-dom";

const Omni7 = ({ children }) => {
  const [allItemData, setAllItemData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [pos, setPos] = useState(0);
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSetCategory = (cat) => {
    setSearchParams({ ...searchParams, category: cat });
    setPos(0);
  };

  useEffect(() => {
    let cat_label = searchParams.get("category");
    let cat_value = "0";
    if (cat_label !== "ทั้งหมด") {
      for (let i = 0; i < category.length; i++) {
        if (cat_label === category[i].label) {
          cat_value = category[i].value;
        }
      }
    }
    setLoading(true);
    Firebase.database()
      .ref("/omni7")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          let data = [];
          setAmount(Object.keys(result).length);
          Object.keys(result).forEach((id) => {
            let check = false;
            if (cat_value !== "0") {
              for (let i = 0; i < result[id].category.length; i++) {
                if (result[id].category[i].value === cat_value) {
                  check = true;
                }
              }
            } else if (cat_value === "0") {
              check = true;
            }
            if (check) {
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
            }
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
  }, [searchParams]);

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
  }, [itemData]);

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
          <div className="ml-[10px]">
            <Header />
          </div>
          <div className="flex gap-2 mb-3 w-[80%] mx-auto">
            <div className="flex flex-wrap gap-3">
              {category.map((cat, index) => {
                return (
                  <div
                    key={["CategoryTag", cat.value].join("_")}
                    className={`underline cursor-pointer ${
                      cat.label === searchParams.get("category") &&
                      "text-blue-600"
                    }`}
                    onClick={() => handleSetCategory(cat.label)}
                  >
                    {cat.label}
                  </div>
                );
              })}
            </div>
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
              {Math.ceil((pos + 1) / 20)}/{Math.ceil(allItemData.length / 20)}
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
    <div className="flex justify-center items-end gap-2">
      <p className="m-0 md:text-[40px] text-[30px]">สินค้า</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">ทั้งหมด</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">
        (7-Eleven)
      </p>
    </div>
  );
};

const category = [
  { value: "0", label: "ทั้งหมด" },
  { value: "1", label: "7 Premium" },
  { value: "2", label: "ข้าวและข้าวเหนียว" },
  { value: "3", label: "บะหมี่สำเร็จรูป" },
  { value: "4", label: "เครื่องปรุงและเครื่องเทศ" },
  { value: "5", label: "อาหารแห้ง" },
  { value: "6", label: "อาหารกระป๋อง" },
  { value: "7", label: "น้ำ" },
  { value: "8", label: "กาแฟ" },
  { value: "9", label: "ชาต่างๆ" },
  { value: "10", label: "ชาดำ" },
  { value: "11", label: "น้ำอัดลม" },
  { value: "12", label: "เครื่องดื่มกีฬา" },
  { value: "13", label: "อาหาร เครื่องดื่ม" },
  { value: "14", label: "บ้าน และครัว" },
  { value: "15", label: "เครื่องสำอางค์และความงาม" },
  { value: "16", label: "อุปกรณ์เครื่องเขียน" },
];
export default Omni7;
