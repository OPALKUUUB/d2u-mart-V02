import { useEffect, useRef, useState } from "react";
import BackButt from "../../../../component/button/BackButt";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCard from "../../../../component/SubCard/ProductCard";
import Loading from "../../../../component/Loading/Loading";
import { useSearchParams } from "react-router-dom";
import FooterV2 from "../../../../component/Footer/FooterV2";

const ref = "disney";
const head = "Tokyo DisneySea";
const Disney = ({ children }) => {
  const [allItemData, setAllItemData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMore, setShowMore] = useState(false);

  const handleSetCategory = (cat) => {
    setSearchParams({ ...searchParams, category: cat });
    setItemData(() => {
      if (cat === "ทั้งหมด") {
        return allItemData;
      }
      let data = allItemData;
      let cat_label = cat;
      let temp = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].category.length; j++) {
          if (cat_label === data[i].category[j].label) {
            temp.push(data[i]);
          }
        }
      }
      return temp;
    });
  };

  async function FetchData(amount) {
    let data = [];
    await Firebase.database()
      .ref("/" + ref)
      .limitToFirst(amount)
      .once("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          Object.keys(result).forEach((id) => {
            let item = {
              id: id,
              name: result[id]?.name,
              // category: result[id]?.category,
              price: result[id]?.price,
              expire_date: result[id]?.expire_date,
              image: result[id]?.image,
              description: result[id]?.description,
              channel: ref,
            };
            data.push(item);
          });
        } else {
          console.log("no data in firebase");
        }
      });
    return data;
  }
  async function FetchDataAll() {
    let data = [];
    await Firebase.database()
      .ref("/" + ref)
      .once("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          Object.keys(result).forEach((id) => {
            let item = {
              id: id,
              name: result[id]?.name,
              // category: result[id]?.category,
              price: result[id]?.price,
              expire_date: result[id]?.expire_date,
              image: result[id]?.image,
              description: result[id]?.description,
              channel: ref,
            };
            data.push(item);
          });
        } else {
          console.log("no data in firebase");
        }
      });
    return data;
  }
  const handleShowMore = () => {
    setShowMore(true);
    setLoading(true);
    setItemData(() => {
      let data = allItemData;
      // console.log(searchParams.get("category"), data[0].category);
      // if (
      //   searchParams.get("category") !== null &&
      //   searchParams.get("category") !== "ทั้งหมด"
      // ) {
      //   let cat_label = searchParams.get("category");
      //   let temp = [];
      //   for (let i = 0; i < data.length; i++) {
      //     for (let j = 0; j < data[i].category.length; j++) {
      //       if (cat_label === data[i].category[j].label) {
      //         temp.push(data[i]);
      //       }
      //     }
      //   }
      //   return temp;
      // }
      return data;
    });
    setLoading(false);
  };
  useEffect(() => {
    async function initial() {
      setLoading(true);
      let data = await FetchData(50);
      setItemData(() => {
        // console.log(searchParams.get("category"), data[0].category);
        // if (
        //   searchParams.get("category") !== null &&
        //   searchParams.get("category") !== "ทั้งหมด"
        // ) {
        //   let cat_label = searchParams.get("category");
        //   let temp = [];
        //   for (let i = 0; i < data.length; i++) {
        //     for (let j = 0; j < data[i].category.length; j++) {
        //       if (cat_label === data[i].category[j].label) {
        //         temp.push(data[i]);
        //       }
        //     }
        //   }
        //   return temp;
        // }
        return data;
      });
      setLoading(false);
      data = await FetchDataAll();
      setAllItemData(data);
    }
    initial();
  }, []);

  return (
    <section style={{ fontFamily: '"Prompt", sans-serif' }}>
      <Loading show={loading} />
      <BackButt link="/mart/shop" />
      {/* <img
        src="/image/7-eleven.png"
        className="w-full object-cover object-center"
        alt=""
      /> */}
      <div className="w-full bg-[#ece7e2] py-[50px]" ref={sectionRef}>
        <div
          className="w-[100%] md:w-[95%] mx-auto"
          style={{
            padding: "30px 20px",
            border: "1px solid white",
            borderRadius: "10px",
            background: "#F5F5F5",
          }}
        >
          <div className="ml-[10px]">
            <Header />
          </div>
          <div className="flex gap-2 mb-3 w-[80%] mx-auto">
            <div className="flex flex-wrap gap-3">
              {/* {category.map((cat, index) => {
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
              })} */}
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mb-3">
            {itemData?.map((item, index) => (
              <ProductCard
                key={["ProductCard", item.id].join("_")}
                name={item?.name || "no name"}
                data={item}
              />
            ))}
          </div>
          {showMore === false && (
            <div className="flex justify-center items-center">
              <span
                className="underline cursor-pointer"
                onClick={handleShowMore}
              >
                แสดงเพิ่มเติม
              </span>
            </div>
          )}
        </div>
      </div>
      <Basket />
      <FooterV2 />
    </section>
  );
};

const Header = () => {
  return (
    <div className="flex justify-center items-end gap-2">
      <p className="m-0 md:text-[40px] text-[30px]">สินค้า</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">ทั้งหมด</p>
      <p className="m-0 md:text-[39px] text-[#f0a28e] text-[30px]">({head})</p>
    </div>
  );
};

const category = [
  { value: "0", label: "ทั้งหมด" },
  { value: "1", label: "7 Premium" },
  { value: "2", label: "ข้าวและข้าวเหนียว" },
  { value: "3", label: "บะหมี่สำเร็จรูป" },
  // { value: "4", label: "เครื่องปรุงและเครื่องเทศ" },
  { value: "5", label: "อาหารแห้ง" },
  { value: "6", label: "อาหารกระป๋อง" },
  // { value: "7", label: "น้ำ" },
  // { value: "8", label: "กาแฟ" },
  // { value: "9", label: "ชาต่างๆ" },
  // { value: "10", label: "ชาดำ" },
  // { value: "11", label: "น้ำอัดลม" },
  // { value: "12", label: "เครื่องดื่มกีฬา" },
  { value: "13", label: "อาหาร เครื่องดื่ม" },
  // { value: "14", label: "บ้าน และครัว" },
  // { value: "15", label: "เครื่องสำอางค์และความงาม" },
  // { value: "16", label: "อุปกรณ์เครื่องเขียน" },
];
export default Disney;
