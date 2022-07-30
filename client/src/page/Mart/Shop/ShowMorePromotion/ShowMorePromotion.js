import BackButt from "../../../../component/button/BackButt";
import SubCard from "../../../../component/SubCard/SubCard";
import "../../Martshop/MartMenu.css";
import { useEffect, useState } from "react";
import { getAllCategory, getItemInCategory } from "../api";
import MartCategory from "../../../../component/MartCategory/MartCategory";
import { useNavigate } from "react-router-dom";
import Basket from "../../../../component/Basket/Basket";
import Firebase from "../../../../Firebase/FirebaseConfig";
import ProductCategory from "../../../../component/ProductCategory/ProductCategory";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper";

const ShowMorePromotion = ({ children }) => {
  // useSearchParams
  const [ewilciaData, setEwilciaData] = useState([]);
  const [show, setShow] = useState(10);
  const [allCategory, setAllCategory] = useState([]);
  const [categorySelected, setCategorySelected] = useState(0);
  const [allItemData, setAllItemData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [numberOfPage, setNumberOfPage] = useState(0);
  const [pageIndexList, setPageIndexList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    Firebase.database()
      .ref("/promotion")
      .on("value", (snapshot) => {
        if (snapshot.val()) {
          let result = snapshot.val();
          let data = [];
          Object.keys(result).forEach((id) => {
            let item = {
              code: id,
              name: result[id]?.name,
              category: result[id]?.category,
              price: result[id]?.price,
              expire_date: result[id]?.expire_date,
              image: result[id]?.image,
              description: result[id]?.description,
            };
            data.push(item);
          });
          setEwilciaData(data);
          console.log(data);
          setAllItemData(data);
          let indexList = [];
          for (let i = 0; i < Math.ceil(data.length / 18); i++) {
            indexList.push(i + 1);
          }
          setPageIndexList(indexList);
        } else {
          setEwilciaData([]);
          setAllItemData([]);
        }
      });
    return () => {
      Firebase.database().ref("/omni7").off();
    };
  }, []);

  return (
    <section
      style={{ backgroundColor: "#e6e5e1", fontFamily: '"Prompt", sans-serif' }}
    >
      <BackButt link="/mart/shop" />
      <img src="/image/daisoCover.png" className="cover" alt=""></img>
      <div
        id="allProduct"
        className="w-full flex flex-col bg-[#e6e5e1] items-center py-24 gap-12"
      >
        <div className="w-full max-w-[1800px] flex flex-col items-center gap-8">
          <div className="w-full flex justify-center items-end gap-2 pl-[10px]">
            <p className="m-0 text-[50px]">สินค้า</p>
            <p className="m-0 text-[49px] text-[#f0a28e]">ทั้งหมด</p>
          </div>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center gap-x-2 gap-y-2">
            {allItemData.map((item, index) => {
              if (index >= currentPage * 18 && index < (currentPage + 1) * 18) {
                return (
                  <SubCard
                    key={`subcard${index}`}
                    text={item?.name}
                    image_url={item?.image}
                    price={item?.price}
                    item={item}
                  />
                );
              }
            })}
          </div>
        </div>
        <div className="w-full flex justify-center items-start max-w-[550px] gap-[10px] py-1 relative">
          <p className="m-0 text-[22px] pt-2">หน้า</p>
          <div
            className="flex w-full justify-center"
            style={{ maxWidth: `${(numberOfPage * 550) / 10}px` }}
          >
            {pageIndexList && (
              <Swiper
                navigation={true}
                modules={[Navigation, Pagination]}
                pagination={{
                  clickable: true,
                }}
                slidesPerView={numberOfPage >= 10 ? 10 : numberOfPage}
                slidesPerGroup={10}
                spaceBetween={8}
                className=" w-full flex justify-center justify-items-center h-[100px] relative px-1 showmore py-1"
              >
                {pageIndexList?.map((page, index) => (
                  <SwiperSlide key={`pageIndexList${index}`}>
                    <div
                      className={`cursor-pointer p-2 rounded-xl text-gray-500 border-gray-300 border-[2px] flex items-center justify-center hover:scale-110 ease-linear duration-150 ${
                        currentPage === index && "bg-[#c8ceca]"
                      }`}
                      onClick={() => {
                        setCurrentPage(index);
                        window.location.href = "#allProduct";
                      }}
                    >
                      <p className="m-0 text-[16px] text-center">{page}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>
      </div>
      <Basket />
    </section>
  );
};

export default ShowMorePromotion;
