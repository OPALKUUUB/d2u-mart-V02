import { useEffect, useRef, useState } from "react";
import BackButt from "../../../../component/button/BackButt";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCard from "../../../../component/SubCard/ProductCard";
import Loading from "../../../../component/Loading/Loading";
import { useSearchParams } from "react-router-dom";
import FooterV2 from "../../../../component/Footer/FooterV2";

const ref = "donki";
const head = "Donki";
const Disney = ({ children }) => {
  const [allItemData, setAllItemData] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef();
  const [searchParams, setSearchParams] = useSearchParams();
  // const [showMore, setShowMore] = useState(false);

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
  // const handleShowMore = () => {
  //   setShowMore(true);
  //   setLoading(true);
  //   setItemData(() => {
  //     let data = allItemData;
  //     return data;
  //   });
  //   setLoading(false);
  // };

  const handleSelectPage = (index) => {
    setItemData(allItemData.slice(index * 50, (index + 1) * 50));
    setSearchParams({
      category: searchParams.get("category"),
      page: index + 1,
    });
  };

  const handleNextPage = () => {
    let page = parseInt(searchParams.get("page"));
    let lastPage = Math.ceil(allItemData.length / 50);
    if (page >= lastPage) {
      console.log(page, lastPage);
    } else {
      setItemData(allItemData.slice(page * 50, (page + 1) * 50));
      setSearchParams({
        category: searchParams.get("category"),
        page: page + 1,
      });
    }
  };
  const handlePrevPage = () => {
    let page = parseInt(searchParams.get("page"));
    let lastPage = Math.ceil(allItemData.length / 50);

    if (page === 0) {
      console.log(page, lastPage);
    } else {
      setItemData(allItemData.slice((page - 1) * 50, page * 50));
      setSearchParams({
        category: searchParams.get("category"),
        page: page - 1 === 0 ? 1 : page - 1,
      });
    }
  };
  useEffect(() => {
    async function initial() {
      setLoading(true);
      let data = await FetchData(50);
      setItemData(() => {
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
            <div className="flex flex-wrap gap-3"></div>
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
          <div className="w-100 flex justify-center pt-3 ">
            {Math.ceil(allItemData.length / 50) > 0 ? (
              <div className="flex cursor-pointer">
                <div
                  className={`w-[70px] h-[35px] flex items-center justify-center border-2 border-solid ${
                    parseInt(searchParams.get("page")) === 1
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "hover:bg-slate-200 "
                  }`}
                  onClick={handlePrevPage}
                >
                  {"<<"}
                </div>
                {Array(Math.ceil(allItemData.length / 50))
                  .fill("")
                  .map((item, index) => (
                    <div
                      key={["pagination", index + 1].join("_")}
                      className={`w-[35px] h-[35px] flex items-center justify-center border-2 border-solid ${
                        parseInt(searchParams.get("page")) === index + 1
                          ? "bg-slate-800 text-white"
                          : "hover:bg-slate-200 "
                      }`}
                      onClick={() => handleSelectPage(index)}
                    >
                      {index + 1}
                    </div>
                  ))}
                <div
                  className={`w-[70px] h-[35px] flex items-center justify-center border-2 border-solid ${
                    parseInt(searchParams.get("page")) ===
                    Math.ceil(allItemData.length / 50)
                      ? "bg-gray-500 text-white cursor-not-allowed"
                      : "hover:bg-slate-200 "
                  }`}
                  onClick={handleNextPage}
                >
                  >>
                </div>
              </div>
            ) : (
              <div>Pagination is loading...</div>
            )}
          </div>
          {/* {showMore === false && (
            <div className="flex justify-center items-center">
              <span
                className="underline cursor-pointer"
                onClick={handleShowMore}
              >
                แสดงเพิ่มเติม
              </span>
            </div>
          )} */}
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
export default Disney;
