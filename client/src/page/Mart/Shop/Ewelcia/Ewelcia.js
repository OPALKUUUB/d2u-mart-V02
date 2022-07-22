import BackButt from "../../../../component/button/BackButt";
import SubCard from "../../../../component/SubCard/SubCard";
import "../../Martshop/MartMenu.css";
import { useEffect, useState } from "react";
import { getAllCategory, getItemInCategory } from "../api";
import MartCategory from "../../../../component/MartCategory/MartCategory";
import { useNavigate } from "react-router-dom";
import Basket from "../../../../component/Basket/Basket";
//import FirebaseRealtime from "../../../../Firebase/FirebaseRealtimeConfig";

const Ewelcia = ({ children }) => {
  // useSearchParams
  const [ewilciaData, setEwilciaData] = useState([]);
  const [show, setShow] = useState(10);
  // useEffect(() => {
  //   FirebaseRealtime.database()
  //     .ref("/ewelcia")
  //     .on("value", (snapshot) => {
  //       if (snapshot.val()) {
  //         let result = snapshot.val();
  //         let data = [];
  //         Object.keys(result).forEach((id) => {
  //           let item = {
  //             code: id,
  //             name: result[id]?.name,
  //             category: result[id]?.category,
  //             price: result[id]?.price,
  //             expire_date: result[id]?.expire_date,
  //             image: result[id]?.image,
  //             description: result[id]?.description,
  //           };
  //           data.push(item);
  //         });
  //         setEwilciaData(data);
  //         console.log("in");
  //       } else {
  //         setEwilciaData([]);
  //         console.log("inelse");
  //       }
  //     });
  //   return () => {
  //     FirebaseRealtime.database().ref("/ewelcia").off();
  //   };
  // }, []);

  return (
    <div></div>
  );
};

export default Ewelcia;
