import React, { useEffect } from "react";
import Firebase from "../../../../Firebase/FirebaseConfig";

const Ewelcia = () => {
  useEffect(() => {
    Firebase.database()
      .ref("/ewelcia")
      .once("value", (snapshot) => {
        console.log(snapshot.val());
      });
  }, []);
  return <div>Ewelcia</div>;
};

export default Ewelcia;
