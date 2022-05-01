import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import TrackTable from "./TrackTable";
import TrackData from "./TrackData";
import FilterControl from "./FilterControl";
import AddTrackingModal from "../AddTrackingModal";

export default function TrackingV2({ mode, header }) {
  const [trackings, setTrackings] = useState([{}]);
  const [modalShowAdd, setModalShowAdd] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [paginate, setPaginate] = useState({
    offset: 0,
    item: 10,
  });
  const [filter, setFilter] = useState({
    date: "",
    username: "",
    trackId: "",
    roundBoat: "",
    orderBy: 0,
  });

  useEffect(() => {
    FetchTrackings();
  }, [trigger]);

  const FetchTrackings = async () => {
    await fetch(
      `/api/admin/track/v2/${mode}?offset=${paginate.offset}&item=${paginate.item}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filter),
      }
    )
      .then((res) => res.json())
      .then((json) => {
        // console.log(json.data);
        setTrackings(json.data);
      });
  };

  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h3 className="bg-warning p-2">{header} Tracking</h3>
        <Button variant="primary" onClick={() => setModalShowAdd(true)}>
          Add Tracking
        </Button>
      </div>
      <FilterControl
        paginate={paginate}
        setPaginate={setPaginate}
        handleChange={handleChange}
        FetchTrackings={FetchTrackings}
      />
      <TrackTable mode={mode}>
        <TrackData
          trackings={trackings}
          setTrackings={setTrackings}
          mode={mode}
          header={header}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      </TrackTable>
      <AddTrackingModal
        show={modalShowAdd}
        onHide={() => setModalShowAdd(false)}
        mode={mode}
        header={header}
        trigger={trigger}
        setTrigger={setTrigger}
      />
    </>
  );
}
